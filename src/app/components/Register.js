"use client"

import styles from "../styles/Register.module.css"

export default function Register() {
    return (
        <>
        <div className={styles.wrapper}>
            <form className={styles.form}>
                <h1 className={styles.title}>Registrovať sa</h1>

                <input
                type="text"
                placeholder="Používateľské meno"
                className={styles.input}
                />

                <input
                type="email"
                placeholder="E-mail"
                className={styles.input}
                />

                <input
                type="password"
                placeholder="Heslo"
                className={styles.input}
                />

                <input
                type="password"
                placeholder="Potvrď heslo"
                className={styles.input}
                />

                <button className={styles.button}>
                Vytvor účet
                </button>
            </form>
        </div>
        </>
    )
}