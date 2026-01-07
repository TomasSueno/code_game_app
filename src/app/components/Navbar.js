"use client"

import styles from "../styles/Navbar.module.css"
import Link from "next/link"

export default function Navbar() {
    return (
        <>
        <nav className={styles.navbar}>
            <p>Navbar</p>
            <Link href="./login">Login</Link>
            <Link href="./register">Register</Link>
        </nav>
        </>
    )
}