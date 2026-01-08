"use client"

import styles from "../styles/Feedback.module.css"

export default function Feedback() {
    return (
        <>
    <div className={styles.page}>
      <div className={styles.feedback}>
        <h3>Spätná väzba k riešeniu</h3>

        <div className={styles.metrics}>
          <div>
            <span>Správnosť:</span>
            <strong className={styles.ok}>Správne</strong>
          </div>

          <div>
            <span>Čas vykonania:</span>
            <strong>4 minúty a 56 sekúnd</strong>
          </div>

          <div>
            <span>Skóre:</span>
            <strong>86 / 100</strong>
          </div>

          <div>
            <span>Počet pokusov:</span>
            <strong>1</strong>
          </div>
        </div>

<p className={styles.text}>
  Riešenie je správne a využíva vhodnú dátovú štruktúru na zoskupovanie anagramov,
  čo zabezpečuje dobrú čitateľnosť a efektivitu riešenia.
</p>

<p className={styles.text}>
  Slabšou stránkou je opakované triedenie znakov v slovách, ktoré môže pri väčších
  vstupoch mierne zvýšiť časovú náročnosť.
</p>

      </div>
    </div>
    </>
    )
}