const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./catalog.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    image_path TEXT
  )`);
});

module.exports = db;