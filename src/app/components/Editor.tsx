"use client"

import styles from "../styles/Editor.module.css"
import dynamic from 'next/dynamic';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from "next/navigation";
import Tasks from "../data/tasks.json"
import { url } from "inspector";

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function Editor() {

  const [code, setCode] = useState("")

  const [output, setOutput] = useState<string[]>([]);
  const consoleRef = useRef(console.log);

  const tasks = Tasks.tasks


    const pathname = usePathname()
    const decodedPath = decodeURIComponent(pathname)
    const taskName = decodedPath.split("/")[3]


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

    { 
    tasks.map((task, i) => (
      (task.title == taskName) ?
      <div key={i}>
      <h1>{taskName}</h1>
      <p>{task.description}</p>
      <h3>Vstup:</h3>
      <p className={styles.assigment_code}>{task.input}</p>
      <h3>Výstup:</h3>
      <p className={styles.assigment_code}>{task.output}</p>
      <h3>Podmienky:</h3>
      {task.conditions.map((condition, i) => (
        <p key={i} className={styles.condition_text}> - {condition}</p>
      ))}
      </div> 
      : null
    ))
    }
    {/* <p>Napíš funkciu groupAnagrams(words), ktorá zoskupí reťazce tak, aby každá skupina obsahovala slová, ktoré sú 
      navzájom anagramy. <br></br> <br></br> Anagram znamená, že slová majú rovnaké znaky v rovnakom počte, iba v inom poradí.
    </p> */}

  <p className={styles.time}>{minutes} min. a {seconds} sek. práce za sebou</p>

      <button className={styles.runCode} onClick={runCode}>Spustenie kódu</button>
      <Link href="/feedback"><button className={styles.feedback}>Dokončenie úlohy</button></Link>
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
