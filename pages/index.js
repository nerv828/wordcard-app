import Head from 'next/head'
import { useState, useEffect } from 'react'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [words, setWords] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isImportVisible, setIsImportVisible] = useState(false)
  const [importJson, setImportJson] = useState('')
  const [importStatus, setImportStatus] = useState('')

  // Fetch words from DB
  const fetchWords = async () => {
    try {
      const res = await fetch('/api/words')
      const data = await res.json()
      setWords(data)
      setIsLoading(false)
      setIsLoaded(true)
    } catch (err) {
      console.error(err)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchWords()
  }, [])

  // Load progress index from localStorage after words are loaded
  useEffect(() => {
    if (words.length > 0 && isLoaded) {
      const savedIndex = localStorage.getItem('wordcard-index')
      if (savedIndex !== null) {
        const index = parseInt(savedIndex, 10)
        if (index >= 0 && index < words.length) {
          setCurrentIndex(index)
        }
      }
    }
  }, [words.length, isLoaded])

  // Sync index to localStorage
  useEffect(() => {
    if (words.length > 0 && isLoaded) {
      localStorage.setItem('wordcard-index', currentIndex.toString())
    }
  }, [currentIndex, isLoaded, words.length])

  const nextWord = () => {
    if (words.length === 0) return
    setCurrentIndex((currentIndex + 1) % words.length)
    setShowAnswer(false)
  }

  const prevWord = () => {
    if (words.length === 0) return
    setCurrentIndex((currentIndex - 1 + words.length) % words.length)
    setShowAnswer(false)
  }

  const handleFeedback = async (remembered) => {
    const currentWord = words[currentIndex]
    
    try {
      const res = await fetch('/api/words', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: currentWord.id, remembered })
      })
      
      if (res.ok) {
        const updatedWord = await res.json()
        setWords(prev => prev.map(w => w.id === updatedWord.id ? updatedWord : w))
      }
    } catch (err) {
      console.error(err)
    }
    
    // Automatically move to next word after a short delay
    setTimeout(() => {
      nextWord()
    }, 300)
  }

  const handleImport = async () => {
    setImportStatus('正在导入...')
    try {
      const parsed = JSON.parse(importJson)
      const res = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed)
      })
      const result = await res.json()
      if (result.success) {
        setImportStatus(`成功导入 ${result.imported} 个单词，跳过 ${result.skipped} 个已存在的单词。`)
        setImportJson('')
        // Refresh words list
        await fetchWords()
      } else {
        setImportStatus(`导入失败: ${result.error}`)
      }
    } catch (err) {
      setImportStatus('JSON 格式错误，请检查。')
    }
  }

  const toggleFlip = () => setShowAnswer(!showAnswer)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleFlip()
    }
  }

  if (isLoading) {
    return <div className={styles.container}>加载中...</div>
  }

  const currentWord = words[currentIndex]

  return (
    <div className={styles.container}>
      <Head>
        <title>师傅的购物单词本 - 数据库版</title>
      </Head>
      
      <h1 className={styles.title}>🧠 记忆曲线单词本</h1>
      
      {words.length > 0 ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {currentWord?.is_memorized === 1 && (
              <div className={styles.masteredBadge}>✨ 已记忆</div>
            )}
            <div style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', border: '1px solid #cbd5e1' }}>
              📖 学习次数: {currentWord?.learning_count || 0}
            </div>
          </div>

          <div className={styles.levelIndicator}>
            {[1, 2, 3, 4, 5].map(lvl => (
              <div 
                key={lvl} 
                className={`${styles.levelDot} ${(currentWord?.level || 0) >= lvl ? styles.levelDotActive : ''}`}
              />
            ))}
          </div>

          <div 
            role="button"
            tabIndex={0}
            aria-label={`单词卡片: ${currentWord?.japanese}. 点击或按空格键翻转`}
            onKeyDown={handleKeyDown}
            onClick={toggleFlip}
            className={`${styles.card} ${showAnswer ? styles.cardFlipped : ''}`}
          >
            <h2 className={styles.wordJapanese}>{currentWord?.japanese}</h2>
            <p className={styles.wordKana}>{currentWord?.kana}</p>
            
            {showAnswer ? (
              <div className={styles.answerArea}>
                <p className={styles.wordChinese}>{currentWord?.chinese}</p>
                <p className={styles.wordEnglish}>{currentWord?.english}</p>
                <small className={styles.wordSource}>来源: {currentWord?.source}</small>
              </div>
            ) : (
              <p className={styles.hint}>点击或按空格查看释义</p>
            )}
          </div>
          
          {showAnswer ? (
            <div className={styles.feedbackGroup}>
              <button 
                onClick={() => handleFeedback(false)}
                className={`${styles.button} ${styles.buttonForgot}`}
              >
                ❌ 没记住 (Level 0)
              </button>
              <button 
                onClick={() => handleFeedback(true)}
                className={`${styles.button} ${styles.buttonRemember}`}
              >
                ✅ 记住了 (Level +1)
              </button>
            </div>
          ) : (
            <div className={styles.buttonGroup}>
              <button 
                onClick={prevWord}
                className={`${styles.button} ${styles.buttonSecondary}`}
              >
                ← 上一个
              </button>
              <button 
                onClick={nextWord}
                className={`${styles.button} ${styles.buttonPrimary}`}
              >
                下一个 →
              </button>
            </div>
          )}

          <div className={styles.progress}>
            进度: {currentIndex + 1} / {words.length}
          </div>
        </>
      ) : (
        <div className={styles.card}>
          <p>当前数据库为空，请在下方导入词库。</p>
        </div>
      )}

      <div className={styles.adminSection}>
        <button 
          onClick={() => setIsImportVisible(!isImportVisible)}
          className={`${styles.button} ${styles.buttonSecondary} ${styles.buttonSmall}`}
        >
          {isImportVisible ? '🔼 关闭面板' : '📥 导入新词库'}
        </button>

        {isImportVisible && (
          <div className={styles.importPanel}>
            <div className={styles.importTitle}>粘贴 JSON 数据</div>
            <textarea 
              className={styles.importTextarea}
              placeholder='[{"japanese": "便利", "kana": "べんり", "chinese": "方便", "english": "Convenient"}]'
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
            />
            {importStatus && <p style={{ fontSize: '0.8rem', color: '#1e293b', marginBottom: '1rem' }}>{importStatus}</p>}
            <div className={styles.importActions}>
              <button 
                className={`${styles.button} ${styles.buttonPrimary} ${styles.buttonSmall}`}
                onClick={handleImport}
              >
                确认导入
              </button>
            </div>
          </div>
        )}
      </div>
      
      <footer className={styles.footer}>
        <p>词库已接入本地 SQLite 数据库。掌握程度和学习数据持久保存。</p>
      </footer>
    </div>
  )
}
