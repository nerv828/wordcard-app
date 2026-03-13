import fs from 'fs'
import path from 'path'

const filePath = path.join(process.cwd(), 'data/words.json')

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const fileData = fs.readFileSync(filePath, 'utf8')
    const words = JSON.parse(fileData)
    res.status(200).json(words)
  } else if (req.method === 'POST') {
    const { id, remembered } = req.body
    
    const fileData = fs.readFileSync(filePath, 'utf8')
    let words = JSON.parse(fileData)
    
    const wordIndex = words.findIndex(w => w.id === id)
    if (wordIndex === -1) {
      return res.status(404).json({ error: 'Word not found' })
    }

    const word = words[wordIndex]
    word.learning_count = (word.learning_count || 0) + 1
    word.level = remembered ? Math.min((word.level || 0) + 1, 5) : 0
    word.is_memorized = word.level === 5 ? 1 : 0

    // Note: On Vercel this will only persist until the function instance restarts
    try {
      fs.writeFileSync(filePath, JSON.stringify(words, null, 2))
    } catch (e) {
      console.warn('File system is read-only, changes not persisted')
    }

    res.status(200).json(word)
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
