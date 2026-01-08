"use client"

import styles from "../styles/Login.module.css"

export default function Login() {
    return (
        <>
        <div className={styles.wrapper}>
            <form className={styles.form}>
                <h1 className={styles.title}>Prihlásenie</h1>

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

                <button className={styles.button}>
                Prihlásiť sa
                </button>
            </form>
        </div>
        </>
    )
}