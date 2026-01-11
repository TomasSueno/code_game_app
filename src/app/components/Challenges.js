"use client"

import { useParams } from "next/navigation"
import styles from "../styles/Challenges.module.css"
import { useRouter } from "next/navigation"

    const Tasks = {
        JavaScript: [
        "Zoskupenie anagramov",
        "Palindrómový reťazec",
        "Najdlhší spoločný prefix",
        "Zoradenie čísel",
        "Fibonacci sekvencia"
        ],
    Python: [
        "Kontrola platného e-mailu",
        "Generovanie náhodného hesla",
        "Sčítanie prvočísel",
        "Transformácia JSON dát",
        "Vyhľadávanie v binárnom strome"
    ],
    C: [
    "Implementácia zásobníka pomocou poľa",
    "Reverzné prevrátenie reťazca",
    "Hľadanie maxima v poli",
    "Spočítanie slov v texte",
    "Generovanie Fibonacciho sekvencie"
    ]
}

export default function Challenges() {
    const params = useParams()
    const slug = params.slug
    const router = useRouter()
    const tasks = Tasks[slug]

    return (
        <div className={styles.page}>
            <h2>{slug}</h2>
            <div className={styles.cards}>
                {tasks.map((task, index) => (
                    <button 
                        onClick={() => router.push(`/editor/${slug}+${task}`)}
                        key={index}
                        className={styles.card}
                    >
                        {task}
                    </button>
                ))}
            </div>
        </div>
    )
}