import mysql from "mysql2/promise";

export async function up(connection: mysql.Connection): Promise<void> {
  // Create users table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create scan_history table
  await connection.query(`
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
}

export async function down(connection: mysql.Connection): Promise<void> {
  await connection.query("DROP TABLE IF EXISTS scan_history");
  await connection.query("DROP TABLE IF EXISTS users");
}
