"use client"

import styles from "../styles/Footer.module.css"

export default function Footer() {
    return (
        <>
        <footer className={styles.footer}>
            <p className={styles.text}>
                © {new Date().getFullYear()} CodeGame. All rights reserved.
            </p>
        </footer>
        </>
    )
}