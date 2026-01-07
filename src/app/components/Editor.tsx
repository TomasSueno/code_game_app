"use client"

import styles from "../styles/Editor.module.css"
import dynamic from 'next/dynamic';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function Editor() {

  const [code, setCode] = useState("")

  const [output, setOutput] = useState<string[]>([]);
  const consoleRef = useRef(console.log);

  useEffect(() => {
    console.log = (...args: any[]) => {
      const messages = args.map(a => typeof a === "object" ? JSON.stringify(a) : String(a));
      setOutput(prev => [...prev, ...messages]);
      consoleRef.current(...args);
    };
    return () => { console.log = consoleRef.current };
  }, []);

  const runCode = () => {
    setOutput([])
    try { 
      const currentCode = localStorage.getItem("code") ?? "";
      eval(currentCode)
    } 
    catch(e) { setOutput(prev => [...prev, String(e)]); }
  };

useEffect(() => {
  setCode(localStorage.getItem("code") ?? "");
}, []);

  function handleChange(value?: string) {
    const v = value ?? "";
    localStorage.setItem("code", v);
  };


  return (
  <>
  <div className={styles.container}>
    <div className={styles.assignment}>
    <h1>Zadanie: Súčet párnych čísel</h1>
    <p>Napíš program v JavaScripte, ktorý má dané celé číslo n (1 ≤ n ≤ 1000), 
      spočíta súčet všetkých párnych čísel od 1 po n vrátane a výsledok vypíše do konzoly. 
      Príklad: ak je vstup n = 10, výstup bude 30 (2 + 4 + 6 + 8 + 10). 
      Požiadavky: použi cyklus for alebo while a nepoužívaj vstavané funkcie na filtrovanie polí.
    </p>
      <button className={styles.runCode} onClick={runCode}>Run code</button>
      <button className={styles.finishChallengeButton}>Finish challenge</button>
      <Link href="/"><button className={styles.backButton}>Go back home</button></Link>
    </div>
    <MonacoEditor height="100vh" defaultLanguage="javascript" 
    loading={<div className={styles.loading_screen}>Loading ...</div>}
    theme="vs-dark"
    defaultValue={code}
    onChange={handleChange}
      options={{
      minimap: { enabled: false },
      fontSize: 14
    }} />
    <div className={styles.console}>
      <h1>Konzola</h1>
      {output.map((line, i) => <div key={i} className={styles.console_text}>{line}</div>)}
    </div>
  </div>
  </>
  )
}
