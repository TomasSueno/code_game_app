'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from '../styles/AiCheck.module.css';

export default function AiCheck() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!code.trim()) return alert("Najprv vložte kód.");

    setLoading(true);
    setResult('');

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.evaluation || 'Chyba pri komunikácii so serverom');
      }

      setResult(data.evaluation || 'AI nevrátila žiadne vyhodnotenie.');
    } catch (error: any) {
      setResult('❌ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>AI Hodnotiteľ Kódu</h1>
      
      <textarea
        placeholder="Sem vložte svoj kód (napr. JavaScript, Python...)"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={10}
        className={styles.textarea}
      />

      <button 
        onClick={handleSubmit} 
        disabled={loading}
        className={styles.button}
      >
        {loading ? 'Analyzujem...' : 'Analyzovať kód'}
      </button>

      {result && (
        <div className={styles.result}>
          <h3>Výsledok analýzy:</h3>
          <div className={styles.markdown}>
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
