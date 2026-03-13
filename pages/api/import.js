import fs from 'fs'
import path from 'path'

const filePath = path.join(process.cwd(), 'data/words.json')

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const newWords = req.body
  if (!Array.isArray(newWords)) {
    return res.status(400).json({ error: 'Expected an array of words' })
  }

  try {
    const fileData = fs.readFileSync(filePath, 'utf8')
    let words = JSON.parse(fileData)
    
    let importedCount = 0
    let skippedCount = 0

    for (const newWord of newWords) {
      const { japanese, kana, chinese, english, source } = newWord
      
      if (!japanese) {
        skippedCount++
        continue
      }

      const existingIndex = words.findIndex(w => w.japanese === japanese)
      if (existingIndex === -1) {
        const nextId = words.length > 0 ? Math.max(...words.map(w => w.id)) + 1 : 1
        words.push({
          id: nextId,
          japanese,
          kana: kana || '',
          chinese: chinese || '',
          english: english || '',
          source: source || 'Imported',
          learning_count: 0,
          level: 0,
          is_memorized: 0
        })
        importedCount++
      } else {
        skippedCount++
      }
    }

    try {
      fs.writeFileSync(filePath, JSON.stringify(words, null, 2))
    } catch (e) {
      console.warn('File system is read-only, changes not persisted')
    }

    res.status(200).json({ 
      success: true,
      message: 'Import completed', 
      imported: importedCount, 
      skipped: skippedCount 
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to import words', details: err.message })
  }
}
