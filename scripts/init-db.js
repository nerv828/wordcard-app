const sqlite3 = require('sqlite3')
const { open } = require('sqlite')
const fs = require('fs')
const path = require('path')

async function setup() {
  const db = await open({
    filename: path.join(__dirname, '../database.sqlite'),
    driver: sqlite3.Database
  })

  await db.exec(`
    CREATE TABLE IF NOT EXISTS words (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      japanese TEXT NOT NULL UNIQUE,
      kana TEXT,
      chinese TEXT,
      english TEXT,
      source TEXT,
      learning_count INTEGER DEFAULT 0,
      level INTEGER DEFAULT 0,
      is_memorized INTEGER DEFAULT 0
    )
  `)

  const wordsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/words.json'), 'utf8'))

  for (const word of wordsData) {
    await db.run(
      `INSERT OR IGNORE INTO words (japanese, kana, chinese, english, source) VALUES (?, ?, ?, ?, ?)`,
      [word.japanese, word.kana, word.chinese, word.english, word.source]
    )
  }

  console.log('Database initialized successfully!')
}

setup().catch(err => {
  console.error(err)
  process.exit(1)
})
