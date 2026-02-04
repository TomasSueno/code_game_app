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

  const MAX_PASTE = 2000;

const handleEditorMount = (editor: any, monaco: any) => {
  const pasteCommand = editor.addCommand(
    monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV,
    async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (!text) return;

        const selection = editor.getSelection();
        if (!selection) return;

        editor.executeEdits("obmedzenie-vloženia", [
          {
            range: selection,
            text: text.slice(0, MAX_PASTE),
            forceMoveMarkers: true
          }
        ]);
      } catch {
        /* prístup ku schránke zamietnutý */
      }
    }
  );

  editor.onDidDispose(() => {
    editor.removeCommand(pasteCommand);
  });
};

useEffect(() => {
  console.log = (...args: any[]) => {
    const messages = args.map(a =>
      typeof a === "object" ? JSON.stringify(a) : String(a)
    );
    setOutput(prev => [...prev, ...messages]);
    consoleRef.current(...args);
  };
  return () => { console.log = consoleRef.current };
}, []);

const createWorker = () => {
  const blob = new Blob([`
    self.console = {
      log: (...args) =>
        postMessage({
          type: "log",
          data: args.map(a =>
            typeof a === "object" ? JSON.stringify(a) : String(a)
          )
        })
    };

    self.onmessage = (e) => {
      const { code, fnName, input } = e.data;
      try {
        let iterations = 0;

        ['forEach','map','filter','reduce','some','every','sort'].forEach(method => {
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
          data: { output: result, iterations }
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
    if (type === "error") setOutput(prev => [...prev, "Chyba: " + data]);
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
    if (startRef.current !== null) {
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

  if (!task.tests) return;

  const results: string[] = [];
  let passedCount = 0;
  let totalCount = 0;
  let totalScore = 0;
  let scoreCount = 0;
  let testIndex = 0;

  const runNext = () => {
    if (testIndex >= task.tests.length) {
      const avgScore = scoreCount
        ? Math.round(totalScore / scoreCount)
        : 0;

      results.push(`====================`);
      results.push(`Úspešné testy: ${passedCount} / ${totalCount}`);
      results.push(`Priemerné skóre: ${avgScore}/100`);
      results.push(
        passedCount === totalCount
          ? `Výsledok: ✅ ÚSPECH`
          : `Výsledok: ❌ NEÚSPECH`
      );
      results.push(`====================`);

      setOutput(results);
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

          const charCount = code.length;
          const lineCount = code.split("\n").length;
          const timeSeconds = hours * 3600 + minutes * 60 + seconds;
          const iterations = data.iterations;

          const rawScore = Math.round(
            100 * (1 - (
              0.25 * Math.min(charCount / 1000, 1) +
              0.25 * Math.min(lineCount / 100, 1) +
              0.20 * Math.min(timeSeconds / 600, 1) +
              0.30 * Math.min(iterations / 1e6, 1)
            ))
          );

          const score = passed ? rawScore : 0;

          totalScore += score;
          scoreCount++;

          results.push(`Test „${test.name}“: ${passed ? "✅" : "❌"}`);
          results.push(`Počet iterácií: ${iterations}`);
          results.push(`Počet riadkov: ${lineCount}`);
          results.push(`Počet znakov: ${charCount}`);
          results.push(`Čas: ${hours} hod., ${minutes} min., ${seconds} sek.`);
          results.push(`Skóre: ${score}/100`);

          if (
            !(testIndex === task.tests.length - 1 &&
              caseIndex === test.cases.length - 1)
          ) {
            results.push(`-----------------------------------------`);
          }

          caseIndex++;
          runCase();
        }

        if (type === "error") {
          results.push(`Test „${test.name}“: ❌ Chyba: ${data}`);
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

return (
  <div className={styles.container}>
    <div className={styles.assignment}>
      {tasks.map((task, i) =>
        task.title === taskName ? (
          <div key={i}>
            <h1>{taskName}</h1>
            <p>{task.description}</p>
            <h3>Vstup:</h3>
            <p className={styles.assigment_code}>{task.input}</p>
            <h3>Výstup:</h3>
            <p className={styles.assigment_code}>{task.output}</p>
            <h3>Podmienky:</h3>
            {task.conditions.map((condition, i) => (
              <p key={i} className={styles.condition_text}>- {condition}</p>
            ))}
          </div>
        ) : null
      )}

      <p className={styles.time}>
        {hours >= 1 ? `${hours} hod., ` : ""}
        {minutes} min. a {seconds} sek. nepretržitej práce
      </p>

      <button className={styles.runCode} onClick={runCode}>
        Spustiť kód
      </button>

      <button className={styles.feedback} onClick={checkSolution}>
        Odovzdať riešenie
      </button>

      <Link href="/">
        <button className={styles.backButton}>
          Návrat na hlavnú stránku
        </button>
      </Link>
    </div>

    <MonacoEditor
      height="100vh"
      language={language}
      onMount={handleEditorMount}
      loading={<div className={styles.loading_screen}>Načítavam…</div>}
      theme="vs-dark"
      value={code}
      onChange={(v) => {
        setCode(v ?? "")
        localStorage.setItem("code", v ?? "")
      }}
      options={{
        minimap: { enabled: false },
        fontSize: 14
      }}
    />

    <div className={styles.console}>
      <h1>Konzola</h1>
      {output.map((line, i) => (
        <div key={i} className={styles.console_text}>{line}</div>
      ))}
    </div>
  </div>
);
}
