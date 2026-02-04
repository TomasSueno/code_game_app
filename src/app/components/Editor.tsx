"use client"

import styles from "../styles/Editor.module.css"
import dynamic from 'next/dynamic';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from "next/navigation";
import Tasks from "../data/tasks.json"
import { useRouter } from "next/navigation";

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

  interface Task {
    title: string;
    description: string;
    input: string;
    output: string;
    conditions: string[];
    functionName: string;
  }

export default function Editor() {
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
  
  const router = useRouter()

  const MAX_PASTE = 200;

const handleEditorMount = (editor: any, monaco: any) => {
  const pasteCommand = editor.addCommand(
    monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV,
    async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (!text) return;

        const selection = editor.getSelection();
        if (!selection) return;

        editor.executeEdits("paste-limit", [
          {
            range: selection,
            text: text.slice(0, MAX_PASTE),
            forceMoveMarkers: true
          }
        ]);
      } catch {
        /* clipboard access denied */
      }
    }
  );

  editor.onDidDispose(() => {
    editor.removeCommand(pasteCommand);
  });
};


  useEffect(() => {
    console.log = (...args: any[]) => {
      const messages = args.map(a => typeof a === "object" ? JSON.stringify(a) : String(a));
      setOutput(prev => [...prev, ...messages]);
      consoleRef.current(...args);
    };
    return () => { console.log = consoleRef.current };
  }, []);

const createWorker = () => {
  const blob = new Blob([`
    self.console = {
      log: (...args) =>
        postMessage({ type: "log", data: args.map(a => typeof a === "object" ? JSON.stringify(a) : String(a)) })
    };

    self.onmessage = (e) => {
      const { code, fnName, input } = e.data;
      try {
        let iterations = 0;

        ['forEach', 'map', 'filter', 'reduce', 'some', 'every', 'sort'].forEach(method => {
          const original = Array.prototype[method];
          Array.prototype[method] = function(...args) {
            iterations += this.length;
            return original.apply(this, args);
          };
        });

        const fn = eval(code + '; ' + fnName);

        const wrappedFn = (...args) => {
          iterations++;
          return fn(...args);
        };

        let userInput = Array.isArray(input[0]) ? input[0] : input;
        const result = wrappedFn(userInput);

        postMessage({
          type: "result",
          data: {
            output: result,
            iterations
          }
        });

      } catch (err) {
        postMessage({ type: "error", data: String(err) });
      }
    };
  `], { type: "application/javascript" });

  return new Worker(URL.createObjectURL(blob));
};




const runCode = () => {
  setOutput([]);
  if (workerRef.current) workerRef.current.terminate();
  const worker = createWorker();

  worker.onmessage = (e) => {
    const { type, data } = e.data;
    if (type === "log") setOutput(prev => [...prev, ...data]);
    if (type === "error") setOutput(prev => [...prev, "Error: " + data]);
  };

  worker.postMessage({
    code,
    fnName: "groupAnagrams",
    input: [[["eat", "tea", "tan", "ate", "nat", "bat"]]]
  });

  workerRef.current = worker;
};



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
  const task = tasks.find(t => t.title === taskName);
  if (!task) return;
  setOutput([]);
  if (workerRef.current) workerRef.current.terminate();
  const worker = createWorker();
  workerRef.current = worker;

  if (task.tests) {
    const results: string[] = [];
    let passedCount = 0;
    let totalCount = 0;

    let testIndex = 0;

    const runNext = () => {
      if (testIndex >= task.tests.length) {
        setOutput(results);
        if (passedCount === totalCount) {
        //   router.push({
        //   pathname: "/feedbackSuccess",
        //   query: {
        //     code,
        //     seconds,
        //     output,
        //   },
        // });

        router.push(
  `/feedbackSuccess?hours=${hours}&?minutes=${minutes}&seconds=${seconds}`
);
        } else {
          router.push("/feedbackFail");   
        }
        return;
      }

      const test = task.tests[testIndex];
      let caseIndex = 0;

      const runCase = () => {
        if (caseIndex >= test.cases.length) {
          testIndex++;
          runNext();
          return;
        }

        const testCase = test.cases[caseIndex];
        totalCount++;

        worker.onmessage = (e) => {
          const { type, data } = e.data;
          if (type === "result") {
            const expected = JSON.stringify(testCase.output);
            const returned = JSON.stringify(data.output);
            const passed = returned === expected;
            if (passed) passedCount++;

            results.push(`Test "${test.name}" case ${caseIndex + 1}: ${passed ? "✅" : "❌"}`);
            results.push(`Loop Iterations: ${data.iterations}`);
            results.push(`Count of lines: ${code.split("\n").length}`);
            results.push(`Count of characters: ${code.length}`);
            results.push(`Time: ${hours} hod., ${minutes} min. a ${seconds} sek.`);

            caseIndex++;
            runCase();
          }
          if (type === "error") {
            results.push(`Test "${test.name}" case ${caseIndex + 1}: ❌ Error: ${data}`);
            caseIndex++;
            runCase();
          }
        };

        worker.postMessage({
          code,
          fnName: task.functionName || "mainFunction",
          input: [testCase.input]
        });
      };

      runCase();
    };

    runNext();
  }
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

  <p className={styles.time}>{hours >= 1 ? <> {hours} hod.,  </> : null}{minutes} min. a {seconds} sek. práce za sebou</p>

      <button className={styles.runCode} onClick={runCode}>Spustenie kódu</button>
      <Link href="/feedback"></Link>
      <button className={styles.feedback} onClick={checkSolution}>Dokončenie úlohy</button>
      <Link href="/"><button className={styles.backButton}>Návrat na hlavnú stránku</button></Link>
    </div>
    <MonacoEditor height="100vh" language={language}
    onMount={handleEditorMount}
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
