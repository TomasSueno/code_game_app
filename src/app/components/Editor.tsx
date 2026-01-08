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

const [seconds, setSeconds] = useState(0)
const [minutes, setMinutes] = useState(0)
const start = performance.now()

useEffect(() => {
  const interval = setInterval(() => {
    const elapsed = Math.round((performance.now() - start) / 1000);
    const newMinutes = elapsed / 60;
    const newSeconds = elapsed % 60;
    if(newMinutes % 1 == 0) {
      setMinutes(newMinutes)
    }
    setSeconds(newSeconds)
  }, 1000);

  return () => clearInterval(interval);
}, []);

  return (
  <>
  <div className={styles.container}>
    <div className={styles.assignment}>

    <h1>Zadanie: Zoskupenie anagramov</h1>
    <p>Napíš funkciu groupAnagrams(words), ktorá zoskupí reťazce tak, aby každá skupina obsahovala slová, ktoré sú 
      navzájom anagramy. <br></br> <br></br> Anagram znamená, že slová majú rovnaké znaky v rovnakom počte, iba v inom poradí.
    </p>
    <h3>Vstup:</h3>
    <p className={styles.assigment_code}>["eat", "tea", "tan", "ate", "nat", "bat"]</p>
    <h3>Výstup:</h3>
    <p className={styles.assigment_code}>
    [ <br></br>
    ["eat", "tea", "ate"], <br></br>
    ["tan", "nat"], <br></br>
    ["bat"] <br></br>
  ]</p>
  <h3>Podmienky</h3>
    <p>
    - riešenie v JavaScripte <br></br>
    - poradie skupín ani slov nie je dôležité <br></br>
    - riešenie má byť efektívne aj pre väčší počet slov <br></br>
    </p>
  <p>{minutes} minúty a {seconds} sekúnd práce</p>

      <button className={styles.runCode} onClick={runCode}>Spustenie kódu</button>
      <button className={styles.finishChallengeButton}>Dokončenie úlohy</button>
      <Link href="/"><button className={styles.backButton}>Návrat na hlavnú stránku</button></Link>
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
