import Head from 'next/head'
import { useState } from 'react'
import wordsData from '../data/words.json'

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  const nextWord = () => {
    setCurrentIndex((currentIndex + 1) % wordsData.length)
    setShowAnswer(false)
  }

  const word = wordsData[currentIndex]

  return (
    <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <Head>
        <title>师傅的购物单词本</title>
      </Head>
      <h1>🛒 购物单词本</h1>
      <div style={{
        border: '2px solid #333',
        borderRadius: '15px',
        padding: '2rem',
        margin: '2rem auto',
        maxWidth: '400px',
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        cursor: 'pointer',
        backgroundColor: showAnswer ? '#f0f9ff' : '#fff'
      }} onClick={() => setShowAnswer(!showAnswer)}>
        <h2 style={{ fontSize: '2.5rem', margin: '0' }}>{word.japanese}</h2>
        <p style={{ color: '#666' }}>{word.kana}</p>
        
        {showAnswer ? (
          <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
            <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{word.chinese}</p>
            <p style={{ fontStyle: 'italic' }}>{word.english}</p>
            <small style={{ color: '#999' }}>来源: {word.source}</small>
          </div>
        ) : (
          <p style={{ color: '#aaa', marginTop: '1rem' }}>点击查看释义</p>
        )}
      </div>
      
      <button 
        onClick={nextWord}
        style={{
          padding: '10px 20px',
          fontSize: '1rem',
          backgroundColor: '#333',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        下一个单词 →
      </button>
      
      <footer style={{ marginTop: '3rem', color: '#999' }}>
        <p>词库自动同步自师傅的购物小票</p>
      </footer>
    </div>
  )
}
