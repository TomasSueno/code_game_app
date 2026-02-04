"use client"

import styles from "../styles/Feedback.module.css"
import Link from "next/link"
// import { useSearchParams } from "next/navigation";

export default function FeedbackSuccess() {
// const searchParams = useSearchParams();

const seconds = searchParams.get("seconds");
const minutes = searchParams.get("minutes");
const hours = searchParams.get("hours");

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
            <strong>{hours >= 1 ? <> {hours} hod.,  </> : null} {minutes >= 1 || (hours < 1 && minutes == 0) ? <>{minutes} "min. a"</> : null } {seconds} sek.</strong>
          </div>

                    <div>
            <span>Počet pokusov:</span>
            <strong>1</strong>
          </div>

          <div>
            <span>Počet iterácií:</span>
            <strong>7</strong>
          </div>

          <div>
            <span>Skóre:</span>
            <strong>86 / 100</strong>
          </div>

                    <div>
            <span>Počet charakterov v kóde:</span>
            <strong>670</strong>
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

    <Link href="/challenges/JavaScript"><button className={styles.newChallengesButton}>Rieš ďalšie javascriptové úlohy</button></Link>

      </div>
    </div>
    </>
    )
}