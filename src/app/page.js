"use client"

import styles from "./styles/Homepage.module.css"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Link from "next/link"

export default function Home() {
  return (
    <>
    <main className={styles.container}>
      <h1 className={styles.nazov}>
        Edukačný systém na výučbu programovania
      </h1>

      <p className={styles.popis}>
        Webová aplikácia zameraná na učenie programovacích jazykov
        prostredníctvom algoritmických úloh.
      </p>

      <Link href="/programmingLang">
      <button className={styles.tlacidlo}>
        Začať
      </button>
      </Link>
    </main>
    </>
  )
} 