import mysql from "mysql2/promise";

export async function up(connection: mysql.Connection): Promise<void> {
  // Create chat_sessions table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS chat_sessions (
      id VARCHAR(50) PRIMARY KEY,
      user_id VARCHAR(50) NOT NULL,
      title VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Create chat_messages table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      session_id VARCHAR(50) NOT NULL,
      role VARCHAR(20) NOT NULL,
      content TEXT NOT NULL,
      image LONGTEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE
    )
  `);
}

export async function down(connection: mysql.Connection): Promise<void> {
  await connection.query("DROP TABLE IF EXISTS chat_messages");
  await connection.query("DROP TABLE IF EXISTS chat_sessions");
}
