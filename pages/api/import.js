import { openDb } from '../../lib/db'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const words = req.body
  if (!Array.isArray(words)) {
    return res.status(400).json({ error: 'Expected an array of words' })
  }

  const db = await openDb()
  let importedCount = 0
  let skippedCount = 0

  try {
    // Start a transaction for better performance if there are many words
    await db.run('BEGIN TRANSACTION')

    for (const word of words) {
      const { japanese, kana, chinese, english, source } = word
      
      if (!japanese) {
        skippedCount++
        continue
      }

      // Use INSERT OR IGNORE to avoid duplicates based on the UNIQUE constraint on 'japanese'
      const result = await db.run(
        `INSERT OR IGNORE INTO words (japanese, kana, chinese, english, source) VALUES (?, ?, ?, ?, ?)`,
        [japanese, kana || '', chinese || '', english || '', source || 'Imported']
      )

      if (result.changes > 0) {
        importedCount++
      } else {
        skippedCount++
      }
    }

    await db.run('COMMIT')

    res.status(200).json({ 
      message: 'Import completed', 
      success: true,
      imported: importedCount, 
      skipped: skippedCount 
    })
  } catch (err) {
    await db.run('ROLLBACK')
    console.error(err)
    res.status(500).json({ error: 'Failed to import words', details: err.message })
  }
}
