"use client"

import styles from "../styles/Feedback.module.css"
import Link from "next/link"

export default function FeedbackFail() {
    return (
        <>
    <div className={styles.page}>
      <div className={styles.feedback}>
        <h3 className={styles.tryAgain}><p>Nesprávne riešenie</p></h3>
        <p className={styles.failText}>
          Riešenie je správne a využíva vhodnú dátovú štruktúru na zoskupovanie anagramov,
          čo zabezpečuje dobrú čitateľnosť a efektivitu riešenia.
          Slabšou stránkou je opakované triedenie znakov v slovách, ktoré môže pri väčších
          vstupoch mierne zvýšiť časovú náročnosť.
        </p>
        <Link href="/editor/JavaScript/Zoskupenie%20anagramov"><button className={styles.newChallengesButton}>Skús znova</button></Link>
      </div>
          </div>
    </>
    )
}