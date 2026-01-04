"use client"

import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function Editor() {
  return <MonacoEditor height="100vh" defaultLanguage="c" 
  defaultValue="// code" theme="vs-dark"
    options={{
    minimap: { enabled: false },
    fontSize: 14
  }} />
}
