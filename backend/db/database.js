const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

let db = null;
const dbPath = process.env.DB_PATH || path.join(__dirname, 'todo.db');

async function initDatabase() {
  const SQL = await initSqlJs();
  
  // Try to load existing database
  try {
    if (fs.existsSync(dbPath)) {
      const fileBuffer = fs.readFileSync(dbPath);
      db = new SQL.Database(fileBuffer);
    } else {
      db = new SQL.Database();
    }
  } catch (error) {
    console.log('Creating new database...');
    db = new SQL.Database();
  }

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  saveDatabase();
  return db;
}

function saveDatabase() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
}

function getDb() {
  return db;
}

// Helper functions to match better-sqlite3 API
function prepare(sql) {
  return {
    get(...params) {
      const stmt = db.prepare(sql);
      stmt.bind(params);
      if (stmt.step()) {
        const result = stmt.getAsObject();
        stmt.free();
        return result;
      }
      stmt.free();
      return undefined;
    },
    all(...params) {
      const stmt = db.prepare(sql);
      stmt.bind(params);
      const results = [];
      while (stmt.step()) {
        results.push(stmt.getAsObject());
      }
      stmt.free();
      return results;
    },
    run(...params) {
      db.run(sql, params);
      saveDatabase();
      return {
        lastInsertRowid: db.exec("SELECT last_insert_rowid()")[0]?.values[0]?.[0] || 0,
        changes: db.getRowsModified()
      };
    }
  };
}

module.exports = {
  initDatabase,
  getDb,
  prepare,
  saveDatabase
};
