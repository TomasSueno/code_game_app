"use client"

import { log } from 'console';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

export default function Editor() {
  const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

  useEffect(() => {
  try {
    localStorage.setItem("code", "text")
    localStorage.getItem("code")
  } catch (error) {
    
  }
  }, [])

  return (
  <>
  <div className="container">
    <div className="assignment">
      <h1>Zadanie: Súčet párnych čísel</h1>
    <p>Napíš program v JavaScripte, ktorý má dané celé číslo n (1 ≤ n ≤ 1000), 
      spočíta súčet všetkých párnych čísel od 1 po n vrátane a výsledok vypíše do konzoly. 
      Príklad: ak je vstup n = 10, výstup bude 30 (2 + 4 + 6 + 8 + 10). 
      Požiadavky: použi cyklus for alebo while a nepoužívaj vstavané funkcie na filtrovanie polí.
    </p>
      <button className="finishChallengeButton">Finish challenge</button>
      <button className="finishChallengeButton">Save code</button>
    </div>
    <MonacoEditor height="100vh" defaultLanguage="javascript" loading={<div className="loading_screen">Loading ...</div>}
    theme="vs-dark" value='aaaaa'
      options={{
      minimap: { enabled: false },
      fontSize: 14
    }} />
    <div className="console">
      <h1>Konzola</h1>
      <p>aaaa</p>
    </div>
  </div>
  </>
  )
}
