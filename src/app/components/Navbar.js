"use client"

import styles from "../styles/Navbar.module.css"
import Link from "next/link"

export default function Navbar() {
    return (
        <>
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <Link href="/">CodeGame</Link>
            </div>

            <ul className={styles.menu}>
                <li>
                <Link href="/" className={styles.item}>Domov</Link>
                </li>
                <li>
                <Link href="/programmingLang" className={styles.item}>Začni programovať</Link>
                </li>
                <li>
                <Link href="/signUp" className={styles.item}>Registrácia</Link>
                </li>
                <li>
                <Link href="/login" className={styles.item}>Prihlásenie</Link>
                </li>
            </ul>
        </nav>
        </>
    )
}