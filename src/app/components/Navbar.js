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
                <Link href="/" className={styles.item}>Home</Link>
                </li>
                <li>
                <Link href="./aiCheck" className={styles.item}>AiCheck</Link>
                </li>
                <li>
                <Link href="./register" className={styles.item}>Register</Link>
                </li>
                <li>
                <Link href="./login" className={styles.item}>Login</Link>
                </li>
            </ul>
        </nav>
        </>
    )
}