import mysql from "mysql2/promise";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface ScanHistoryItem {
  id: string;
  userId: string;
  wasteId: string;
  name: string;
  category: string;
  confidence: number;
  scannedAt: string;
  co2Offset: number;
  recyclable: boolean;
  imageUrl?: string;
}

export interface UserStats {
  totalScanned: number;
  recyclableCount: number;
  recyclingRate: number;
  totalCo2Offset: number;
  categoryBreakdown: Record<string, number>;
}

export const CO2_MULTIPLIERS: Record<string, number> = {
  "plastic-pet": 2.4,
  "plastic-hdpe": 1.8,
  "paper": 0.5,
  "cardboard": 0.8,
  "glass": 1.2,
  "metal-can": 1.6,
  "metal-non-can": 1.2,
  "organic-waste": 0.3,
  "battery": 0.1,
  "electronic-waste": 0.5,
  "b3-waste": 0.1,
  "medical-waste": 0.0,
};

let pool: mysql.Pool | null = null;

/**
 * Connects to MySQL, automatically checking/creating the target database
 * and table schemas on startup.
 */
async function getPool(): Promise<mysql.Pool> {
  if (pool) return pool;

  const host = process.env.MYSQL_HOST || "127.0.0.1";
  const user = process.env.MYSQL_USER || "root";
  const password = process.env.MYSQL_PASSWORD || "";
  const dbName = process.env.MYSQL_DATABASE || "ecovision_db";
  const port = Number(process.env.MYSQL_PORT || 3306);

  try {
    // 1. Establish initial connection to check/create target database
    const connection = await mysql.createConnection({
      host,
      user,
      password,
      port,
    });
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await connection.end();

    // 2. Initialize connection pool targeting the database
    pool = mysql.createPool({
      host,
      user,
      password,
      database: dbName,
      port,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // 3. Initialize tables
    await initDb(pool);

    console.log("[EcoVision Database] MySQL connection pool initialized and tables verified.");
    return pool;
  } catch (error) {
    console.error("[EcoVision Database] Failed to initialize MySQL pool:", error);
    throw error;
  }
}

/**
 * Generates initial tables in MySQL if they do not exist.
 */
async function initDb(p: mysql.Pool) {
  // Create users table
  await p.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create scan_history table
  await p.query(`
    CREATE TABLE IF NOT EXISTS scan_history (
      id VARCHAR(50) PRIMARY KEY,
      user_id VARCHAR(50) NOT NULL,
      waste_id VARCHAR(50) NOT NULL,
      name VARCHAR(100) NOT NULL,
      category VARCHAR(50) NOT NULL,
      confidence INT NOT NULL,
      scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      co2_offset DECIMAL(5,2) NOT NULL,
      recyclable TINYINT(1) NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  try {
    await p.query("ALTER TABLE scan_history ADD COLUMN image_url LONGTEXT");
  } catch (err: any) {
    if (err.code !== 'ER_DUP_FIELDNAME') {
      console.warn("Could not add image_url column:", err.message);
    }
  }
}

/**
 * USERS TRANSACTIONS
 */

export async function getUsers(): Promise<User[]> {
  const p = await getPool();
  try {
    const [rows] = await p.query("SELECT * FROM users");
    const users = rows as any[];
    return users.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      passwordHash: row.password_hash,
      createdAt: new Date(row.created_at).toISOString(),
    }));
  } catch (error) {
    console.error("Error executing getUsers query:", error);
    return [];
  }
}

export async function saveUser(user: Omit<User, "id" | "createdAt">): Promise<User> {
  const p = await getPool();
  const id = `user_${Math.random().toString(36).substring(2, 11)}`;
  const createdAt = new Date().toISOString();
  
  await p.query(
    "INSERT INTO users (id, name, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)",
    [id, user.name, user.email, user.passwordHash, new Date(createdAt)]
  );

  return {
    id,
    name: user.name,
    email: user.email,
    passwordHash: user.passwordHash,
    createdAt,
  };
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const p = await getPool();
  try {
    const [rows] = await p.query("SELECT * FROM users WHERE email = ?", [email]);
    const list = rows as any[];
    if (list.length === 0) return null;
    const row = list[0];
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      passwordHash: row.password_hash,
      createdAt: new Date(row.created_at).toISOString(),
    };
  } catch (error) {
    console.error("Error executing findUserByEmail query:", error);
    return null;
  }
}

export async function findUserById(id: string): Promise<User | null> {
  const p = await getPool();
  try {
    const [rows] = await p.query("SELECT * FROM users WHERE id = ?", [id]);
    const list = rows as any[];
    if (list.length === 0) return null;
    const row = list[0];
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      passwordHash: row.password_hash,
      createdAt: new Date(row.created_at).toISOString(),
    };
  } catch (error) {
    console.error("Error executing findUserById query:", error);
    return null;
  }
}

/**
 * SCAN HISTORY TRANSACTIONS
 */

export async function getScanHistory(): Promise<ScanHistoryItem[]> {
  const p = await getPool();
  try {
    const [rows] = await p.query("SELECT * FROM scan_history");
    const list = rows as any[];
    return list.map((row) => ({
      id: row.id,
      userId: row.user_id,
      wasteId: row.waste_id,
      name: row.name,
      category: row.category,
      confidence: row.confidence,
      scannedAt: new Date(row.scanned_at).toISOString(),
      co2Offset: Number(row.co2_offset),
      recyclable: Boolean(row.recyclable),
      imageUrl: row.image_url || undefined,
    }));
  } catch (error) {
    console.error("Error executing getScanHistory query:", error);
    return [];
  }
}

export async function getUserHistory(userId: string): Promise<ScanHistoryItem[]> {
  const p = await getPool();
  try {
    const [rows] = await p.query(
      "SELECT * FROM scan_history WHERE user_id = ? ORDER BY scanned_at DESC",
      [userId]
    );
    const list = rows as any[];
    return list.map((row) => ({
      id: row.id,
      userId: row.user_id,
      wasteId: row.waste_id,
      name: row.name,
      category: row.category,
      confidence: row.confidence,
      scannedAt: new Date(row.scanned_at).toISOString(),
      co2Offset: Number(row.co2_offset),
      recyclable: Boolean(row.recyclable),
      imageUrl: row.image_url || undefined,
    }));
  } catch (error) {
    console.error("Error executing getUserHistory query:", error);
    return [];
  }
}

export async function saveScan(
  userId: string,
  item: Omit<ScanHistoryItem, "id" | "userId" | "scannedAt" | "co2Offset">
): Promise<ScanHistoryItem> {
  const p = await getPool();
  const id = `scan_${Math.random().toString(36).substring(2, 11)}`;
  const scannedAt = new Date().toISOString();
  const co2Offset = CO2_MULTIPLIERS[item.wasteId] || 0.2;

  await p.query(
    `INSERT INTO scan_history (id, user_id, waste_id, name, category, confidence, scanned_at, co2_offset, recyclable, image_url) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, userId, item.wasteId, item.name, item.category, item.confidence, new Date(scannedAt), co2Offset, item.recyclable ? 1 : 0, item.imageUrl || null]
  );

  return {
    id,
    userId,
    wasteId: item.wasteId,
    name: item.name,
    category: item.category,
    confidence: item.confidence,
    scannedAt,
    co2Offset,
    recyclable: item.recyclable,
    imageUrl: item.imageUrl,
  };
}

/**
 * STATS CALCULATIONS
 */

export async function getUserStats(userId: string): Promise<UserStats> {
  const history = await getUserHistory(userId);
  const totalScanned = history.length;
  
  if (totalScanned === 0) {
    return {
      totalScanned: 0,
      recyclableCount: 0,
      recyclingRate: 0,
      totalCo2Offset: 0,
      categoryBreakdown: {},
    };
  }

  let recyclableCount = 0;
  let totalCo2Offset = 0;
  const categoryBreakdown: Record<string, number> = {};

  history.forEach((item) => {
    if (item.recyclable) {
      recyclableCount++;
    }
    totalCo2Offset += item.co2Offset;

    const cat = item.category || "Unknown";
    categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + 1;
  });

  const recyclingRate = Math.round((recyclableCount / totalScanned) * 100);
  
  return {
    totalScanned,
    recyclableCount,
    recyclingRate,
    totalCo2Offset: Number(totalCo2Offset.toFixed(2)),
    categoryBreakdown,
  };
}

/**
 * CHAT HISTORY PERSISTENCE HELPMATES
 */

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessageItem {
  id?: number;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  image?: string;
  createdAt?: string;
}

export async function getChatSessions(userId: string): Promise<ChatSession[]> {
  const p = await getPool();
  try {
    const [rows] = await p.query(
      "SELECT * FROM chat_sessions WHERE user_id = ? ORDER BY updated_at DESC",
      [userId]
    );
    const list = rows as Array<{ id: string; user_id: string; title: string; created_at: Date; updated_at: Date }>;
    return list.map((row) => ({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
    }));
  } catch (error) {
    console.error("Error executing getChatSessions query:", error);
    return [];
  }
}

export async function getChatMessages(sessionId: string): Promise<ChatMessageItem[]> {
  const p = await getPool();
  try {
    const [rows] = await p.query(
      "SELECT * FROM chat_messages WHERE session_id = ? ORDER BY id ASC",
      [sessionId]
    );
    const list = rows as Array<{ id: number; session_id: string; role: string; content: string; image: string | null; created_at: Date }>;
    return list.map((row) => ({
      id: row.id,
      sessionId: row.session_id,
      role: row.role as "user" | "assistant",
      content: row.content,
      image: row.image || undefined,
      createdAt: row.created_at.toISOString(),
    }));
  } catch (error) {
    console.error("Error executing getChatMessages query:", error);
    return [];
  }
}

export async function saveChatMessage(
  sessionId: string | null,
  userId: string,
  role: "user" | "assistant",
  content: string,
  image?: string
): Promise<{ sessionId: string; title: string }> {
  const p = await getPool();
  let currentSessionId = sessionId;
  let title = "Obrolan AI EcoVision";

  try {
    if (!currentSessionId || currentSessionId === "new") {
      currentSessionId = `chat_${Math.random().toString(36).substring(2, 11)}`;
      const cleanContent = content.trim().replace(/\n/g, " ");
      title = cleanContent.length > 40 ? cleanContent.substring(0, 40) + "..." : cleanContent || title;

      await p.query(
        "INSERT INTO chat_sessions (id, user_id, title) VALUES (?, ?, ?)",
        [currentSessionId, userId, title]
      );
    } else {
      const [rows] = await p.query(
        "SELECT title FROM chat_sessions WHERE id = ?",
        [currentSessionId]
      );
      const list = rows as Array<{ title: string }>;
      if (list.length > 0) {
        title = list[0].title;
      } else {
        await p.query(
          "INSERT INTO chat_sessions (id, user_id, title) VALUES (?, ?, ?)",
          [currentSessionId, userId, title]
        );
      }
    }

    await p.query(
      "INSERT INTO chat_messages (session_id, role, content, image) VALUES (?, ?, ?, ?)",
      [currentSessionId, role, content, image || null]
    );

    await p.query(
      "UPDATE chat_sessions SET updated_at = NOW() WHERE id = ?",
      [currentSessionId]
    );

    return { sessionId: currentSessionId, title };
  } catch (error) {
    console.error("Error executing saveChatMessage transaction:", error);
    throw error;
  }
}
