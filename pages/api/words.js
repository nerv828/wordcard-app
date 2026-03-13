import { openDb } from '../../lib/db'

export default async function handler(req, res) {
  const db = await openDb()

  if (req.method === 'GET') {
    const words = await db.all('SELECT * FROM words')
    res.status(200).json(words)
  } else if (req.method === 'POST') {
    const { id, remembered } = req.body

    const word = await db.get('SELECT * FROM words WHERE id = ?', [id])
    if (!word) {
      return res.status(404).json({ error: 'Word not found' })
    }

    const newLearningCount = word.learning_count + 1
    const newLevel = remembered ? Math.min(word.level + 1, 5) : 0
    const isMemorized = newLevel === 5 ? 1 : 0

    await db.run(
      'UPDATE words SET learning_count = ?, level = ?, is_memorized = ? WHERE id = ?',
      [newLearningCount, newLevel, isMemorized, id]
    )

    const updatedWord = await db.get('SELECT * FROM words WHERE id = ?', [id])
    res.status(200).json(updatedWord)
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
