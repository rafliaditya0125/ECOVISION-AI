/**
 * clientStorage.ts
 *
 * Browser-side storage helper for EcoVision AI's localStorage mode.
 * When NEXT_PUBLIC_DB_STORAGE=localstorage, all user data (scan history,
 * chat sessions, chat messages) is persisted in browser localStorage instead
 * of a MySQL database. No authentication is required.
 *
 * IMPORTANT: This file must NOT import anything from db.ts or any other
 * server-side module (mysql2, bcryptjs, jsonwebtoken, etc.) to stay
 * compatible with the client-side browser bundle.
 *
 * Keys used:
 *  "ecovision_scan_history"              → LocalScanItem[]
 *  "ecovision_chat_sessions"             → LocalChatSession[]
 *  "ecovision_chat_messages_<sessionId>" → LocalChatMessage[]
 */

// Inline copy — keeps this file free of any server-side (mysql2) imports
const CO2_MULTIPLIERS: Record<string, number> = {
  "plastic-pet": 2.4,
  "plastic-hdpe": 1.8,
  "paper": 0.5,
  "cardboard": 0.8,
  "glass": 1.2,
  "metal-can": 1.6,
  "organic-waste": 0.3,
  "battery": 0.1,
  "electronic-waste": 0.5,
};

// ─── Re-export types so consumers can import from one place ──────────────────

export interface LocalScanItem {
  id: string;
  wasteId: string;
  name: string;
  category: string;
  confidence: number;
  scannedAt: string;
  co2Offset: number;
  recyclable: boolean;
  imageUrl?: string;
}

export interface LocalChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface LocalChatMessage {
  id: string;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  image?: string;
  createdAt: string;
}

export interface LocalStats {
  totalScanned: number;
  recyclableCount: number;
  recyclingRate: number;
  totalCo2Offset: number;
  categoryBreakdown: Record<string, number>;
}

// ─── Guard ────────────────────────────────────────────────────────────────────

/** Returns true when the app is configured to use browser localStorage. */
export function isLocalStorageMode(): boolean {
  return process.env.NEXT_PUBLIC_DB_STORAGE?.toLowerCase() === "localstorage";
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

function uid(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;
}

// ─── Scan History ─────────────────────────────────────────────────────────────

const SCAN_KEY = "ecovision_scan_history";

export function getScanHistory(): LocalScanItem[] {
  return readJSON<LocalScanItem[]>(SCAN_KEY, []);
}

export function saveScan(
  item: Omit<LocalScanItem, "id" | "scannedAt" | "co2Offset">
): LocalScanItem {
  const history = getScanHistory();
  const newItem: LocalScanItem = {
    ...item,
    id: uid(),
    scannedAt: new Date().toISOString(),
    co2Offset: CO2_MULTIPLIERS[item.wasteId] ?? 0.2,
  };
  writeJSON(SCAN_KEY, [newItem, ...history]);
  return newItem;
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export function getStats(): LocalStats {
  const history = getScanHistory();
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

  for (const s of history) {
    if (s.recyclable) recyclableCount++;
    totalCo2Offset += s.co2Offset;
    const cat = s.category || "Unknown";
    categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + 1;
  }

  return {
    totalScanned,
    recyclableCount,
    recyclingRate: Math.round((recyclableCount / totalScanned) * 100),
    totalCo2Offset: Number(totalCo2Offset.toFixed(2)),
    categoryBreakdown,
  };
}

// ─── Chat Sessions ────────────────────────────────────────────────────────────

const SESSIONS_KEY = "ecovision_chat_sessions";

export function getChatSessions(): LocalChatSession[] {
  return readJSON<LocalChatSession[]>(SESSIONS_KEY, []).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

function saveSession(session: LocalChatSession): void {
  const sessions = readJSON<LocalChatSession[]>(SESSIONS_KEY, []);
  const idx = sessions.findIndex((s) => s.id === session.id);
  if (idx >= 0) {
    sessions[idx] = session;
  } else {
    sessions.unshift(session);
  }
  writeJSON(SESSIONS_KEY, sessions);
}

// ─── Chat Messages ────────────────────────────────────────────────────────────

function messagesKey(sessionId: string): string {
  return `ecovision_chat_messages_${sessionId}`;
}

export function getChatMessages(sessionId: string): LocalChatMessage[] {
  return readJSON<LocalChatMessage[]>(messagesKey(sessionId), []);
}

/**
 * Saves a single chat message. Auto-creates a new session when sessionId is
 * null or "new". Returns the active sessionId and session title.
 */
export function saveChatMessage(
  sessionId: string | null,
  role: "user" | "assistant",
  content: string,
  image?: string
): { sessionId: string; title: string } {
  const now = new Date().toISOString();
  let currentSessionId = sessionId && sessionId !== "new" ? sessionId : null;
  let title = "AI EcoVision Chat";

  if (!currentSessionId) {
    // Create new session
    currentSessionId = uid();
    const cleanContent = content.trim().replace(/\n/g, " ");
    title =
      cleanContent.length > 40
        ? cleanContent.substring(0, 40) + "..."
        : cleanContent || title;

    saveSession({
      id: currentSessionId,
      title,
      createdAt: now,
      updatedAt: now,
    });
  } else {
    // Update existing session updatedAt
    const sessions = readJSON<LocalChatSession[]>(SESSIONS_KEY, []);
    const existing = sessions.find((s) => s.id === currentSessionId);
    if (existing) {
      title = existing.title;
      saveSession({ ...existing, updatedAt: now });
    } else {
      // Session doesn't exist yet — create it
      saveSession({
        id: currentSessionId,
        title,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  // Append message
  const messages = getChatMessages(currentSessionId);
  const newMsg: LocalChatMessage = {
    id: uid(),
    sessionId: currentSessionId,
    role,
    content,
    image,
    createdAt: now,
  };
  writeJSON(messagesKey(currentSessionId), [...messages, newMsg]);

  return { sessionId: currentSessionId, title };
}
