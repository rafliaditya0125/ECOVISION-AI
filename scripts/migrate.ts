import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { loadEnvConfig } from "@next/env";

// Load environment variables using Next.js native environment loader
loadEnvConfig(process.cwd());

const host = process.env.MYSQL_HOST || "127.0.0.1";
const user = process.env.MYSQL_USER || "root";
const password = process.env.MYSQL_PASSWORD || "";
const dbName = process.env.MYSQL_DATABASE || "ecovision_db";
const port = Number(process.env.MYSQL_PORT || 3306);

async function run() {
  const isRollback = process.argv.includes("down");
  let connection: mysql.Connection | null = null;

  try {
    // 1. Connect without DB to ensure DB exists
    console.log(`[Migration] Connecting to MySQL at ${host}:${port} as ${user}...`);
    connection = await mysql.createConnection({
      host,
      user,
      password,
      port,
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await connection.end();

    // 2. Connect to the specific database
    connection = await mysql.createConnection({
      host,
      user,
      password,
      database: dbName,
      port,
    });

    // 3. Create migrations metadata table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        run_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const migrationsDir = path.resolve(process.cwd(), "database/migrations");
    if (!fs.existsSync(migrationsDir)) {
      console.log(`[Migration] Directory ${migrationsDir} does not exist. Creating it...`);
      fs.mkdirSync(migrationsDir, { recursive: true });
    }

    const files = fs.readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".ts") || f.endsWith(".js"))
      .sort();

    if (isRollback) {
      // ROLLBACK MODE: Roll back the single last executed migration
      const [rows] = await connection.query(
        "SELECT name FROM migrations ORDER BY id DESC LIMIT 1"
      ) as any[];

      if (rows.length === 0) {
        console.log("[Migration] No migrations to roll back.");
        return;
      }

      const lastMigrationName = rows[0].name;
      console.log(`[Migration] Rolling back: ${lastMigrationName}...`);

      const filePath = path.resolve(migrationsDir, lastMigrationName);
      if (!fs.existsSync(filePath)) {
        throw new Error(`Migration file not found for rollback: ${filePath}`);
      }

      const migration = await import(pathToFileURL(filePath).href);
      if (typeof migration.down !== "function") {
        throw new Error(`Migration ${lastMigrationName} does not export a "down" function.`);
      }

      await connection.beginTransaction();
      try {
        await migration.down(connection);
        await connection.query("DELETE FROM migrations WHERE name = ?", [lastMigrationName]);
        await connection.commit();
        console.log(`[Migration] ✅ Successfully rolled back: ${lastMigrationName}`);
      } catch (err) {
        await connection.rollback();
        console.error(`[Migration] ❌ Rollback failed for ${lastMigrationName}:`, err);
        throw err;
      }
    } else {
      // MIGRATE UP MODE: Run all pending migrations
      const [rows] = await connection.query("SELECT name FROM migrations") as any[];
      const executedMigrations = new Set(rows.map((r: any) => r.name));

      const pending = files.filter((f) => !executedMigrations.has(f));

      if (pending.length === 0) {
        console.log("[Migration] Database is up to date. No pending migrations.");
        return;
      }

      console.log(`[Migration] Found ${pending.length} pending migration(s) to execute.`);

      for (const file of pending) {
        console.log(`[Migration] Running: ${file}...`);
        const filePath = path.resolve(migrationsDir, file);
        const migration = await import(pathToFileURL(filePath).href);

        if (typeof migration.up !== "function") {
          throw new Error(`Migration ${file} does not export an "up" function.`);
        }

        await connection.beginTransaction();
        try {
          await migration.up(connection);
          await connection.query("INSERT INTO migrations (name) VALUES (?)", [file]);
          await connection.commit();
          console.log(`[Migration] ✅ Successfully executed: ${file}`);
        } catch (err) {
          await connection.rollback();
          console.error(`[Migration] ❌ Migration failed at ${file}, rolled back changes:`, err);
          throw err;
        }
      }
    }
  } catch (error) {
    console.error("[Migration] ❌ Migration process failed:", error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

run();
