"use client"

import styles from "./styles/Homepage.module.css"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Link from "next/link"

export default function Home() {
  return (
    <>
      <Navbar />
      <Link href="/editor" className={styles.editorLink}>Code editor</Link>
      <Footer />
    </>
  )
} 
