"use client"

import styles from "../styles/ProgrammingLang.module.css"
import { useRouter } from "next/navigation"

export default function ProgrammingLang() {

    const router = useRouter()
    const languages = [
        "JavaScript",
        "Python",
        "C"
    ]

    return (
        <div className={styles.page}>
            <h2>Začnite plniť nezabudnuteľne programátorské úlohy v týchto jazykoch</h2>
            <div className={styles.cards}>
                {languages.map((lang, index) => (
                    <button onClick={() => router.push(`/challenges/${lang}`)}
                        key={index}
                        className={styles.card}
                    >
                        {lang}
                    </button>
                ))}
            </div>
        </div>
    )
}