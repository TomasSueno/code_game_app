"use client"

import styles from "../styles/Editor.module.css"
import dynamic from 'next/dynamic';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from "next/navigation";
import Tasks from "../data/tasks.json"

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

  interface Task {
    title: string;
    description: string;
    input: string;
    output: string;
    conditions: string[];
  }

export default function Editor() {

     // {
    //   "language": "JavaScript",
    //   "title": "Zoskupenie anagramov",
    //   "description": "Napíš funkciu, ktorá zoskupí reťazce tak, aby každá skupina obsahovala slová, ktoré sú navzájom anagramy.",
    //   "input": "[\"eat\", \"tea\", \"tan\", \"ate\", \"nat\", \"bat\"]",
    //   "output": "[[\"eat\", \"tea\", \"ate\"], [\"tan\", \"nat\"], [\"bat\"]]",
    //   "conditions": [
    //     "riešenie v JavaScripte",
    //     "poradie skupín ani slov nie je dôležité",
    //     "riešenie má byť efektívne"
    //   ]
    // },

  const [code, setCode] = useState("")

  const [output, setOutput] = useState<string[]>([]);
  const consoleRef = useRef(console.log);

  const tasks = Tasks.tasks

  const pathname = usePathname()
  const decodedPath = decodeURIComponent(pathname)
  const taskName = decodedPath.split("/")[3]
  const language = decodedPath.split("/")[2].toLowerCase()

  const [seconds, setSeconds] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [hours, setHours] = useState(0)
  const startRef = useRef<number | null>(null)

  const workerRef = useRef<Worker | null>(null)

  useEffect(() => {
    console.log = (...args: any[]) => {
      const messages = args.map(a => typeof a === "object" ? JSON.stringify(a) : String(a));
      setOutput(prev => [...prev, ...messages]);
      consoleRef.current(...args);
    };
    return () => { console.log = consoleRef.current };
  }, []);


  const runCode = () => {
    setOutput([]);
    if(language == "javascript") {
    if (workerRef.current) workerRef.current.terminate(); // zastav predchádzajúci worker

    const blob = new Blob([`
      self.console = { log: (...args) => postMessage({ type: 'log', data: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)) }) };
      try { ${code} } catch(e) { postMessage({ type: 'error', data: String(e) }); }
    `], { type: "application/javascript" });

    const worker = new Worker(URL.createObjectURL(blob));
    worker.onmessage = (e) => {
      const { type, data } = e.data;
      setOutput(prev => [...prev, ...(Array.isArray(data) ? data : [data])]);
    };
    workerRef.current = worker;
    }

      if (language === "python") {
    const lines = code.split("\n");
    lines.forEach(line => {
      const match = line.match(/print\("(.*)"\)/);
      if (match) setOutput(prev => [...prev, match[1]]);
    });
    return;
  }

  if (language === "c") {
const lines = code.split("\n");

lines.forEach(line => {
  const match = line.match(/printf\s*\(\s*"([^"]*)"\s*\)\s*;?/);
  if (!match) return;

  const text = match[1]
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, "\"");

  setOutput(prev => [...prev, text]);
});

return;

  }

  };


  // Pre javascript

  //   const runCode = () => {
  //   setOutput([]);
  //   if (workerRef.current) workerRef.current.terminate(); // zastav predchádzajúci worker

  //   const blob = new Blob([`
  //     self.console = { log: (...args) => postMessage({ type: 'log', data: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)) }) };
  //     try { ${code} } catch(e) { postMessage({ type: 'error', data: String(e) }); }
  //   `], { type: "application/javascript" });

  //   const worker = new Worker(URL.createObjectURL(blob));
  //   worker.onmessage = (e) => {
  //     const { type, data } = e.data;
  //     setOutput(prev => [...prev, ...(Array.isArray(data) ? data : [data])]);
  //   };
  //   workerRef.current = worker;
  // };

  // Basic, len je tam eval a to nechcem

  // const runCode = () => {
  //   setOutput([])
  //   try { 
  //     const currentCode = localStorage.getItem("code") ?? "";
  //     eval(currentCode)
  //   } 
  //   catch(e) { setOutput(prev => [...prev, String(e)]); }
  // };

  // Trosku vylepsena verzia, len nefunguje spravne

// const runCode = async () => {
//   setOutput([]);
//   try {
//     const currentCode = localStorage.getItem("code") ?? "";
//     const res = await fetch("/api/run", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ code: currentCode, language })
//     });
//     const data = await res.json();
//     setOutput(prev => [...prev, ...(data.output || [])]);
//   } catch (e) {
//     setOutput(prev => [...prev, String(e)]);
//   }
// };


useEffect(() => {
  setCode(localStorage.getItem("code") ?? "");
}, []);

useEffect(() => {
  startRef.current = performance.now()
  const interval = setInterval(() => {
    if(startRef.current !== null) {
      const elapsed = Math.floor((performance.now() - startRef.current) / 1000);
      setHours(Math.floor(elapsed / 3600))
      setMinutes(Math.floor(elapsed / 60) % 60)
      setSeconds(elapsed % 60)
    }
  }, 1000);

  return () => clearInterval(interval);
}, []);

function checkSolution() {
  tasks.forEach(task => {
    task.tests?.forEach(test => {
    console.log(test.cases[0].input)
    })
})
console.log(code)
}

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

  <p className={styles.time}>{hours >= 1 ? <> {hours} hod.,  </> : null}{minutes} min. a {seconds} sek. práce za sebou</p>

      <button className={styles.runCode} onClick={runCode}>Spustenie kódu</button>
      <Link href="/feedback"></Link>
      <button className={styles.feedback} onClick={checkSolution}>Dokončenie úlohy</button>
      <Link href="/"><button className={styles.backButton}>Návrat na hlavnú stránku</button></Link>
    </div>
    <MonacoEditor height="100vh" language={language}
    loading={<div className={styles.loading_screen}>Loading ...</div>}
    theme="vs-dark"
    value={code}
    onChange={(v) => { 
      setCode(v ?? "")
      localStorage.setItem("code", v ?? "") }}
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
