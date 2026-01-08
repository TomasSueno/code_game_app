"use client"

import styles from "../styles/Login.module.css"

export default function Login() {
    return (
        <>
        <div className={styles.wrapper}>
            <form className={styles.form}>
                <h1 className={styles.title}>Login</h1>

                <input
                type="email"
                placeholder="Email"
                className={styles.input}
                />

                <input
                type="password"
                placeholder="Password"
                className={styles.input}
                />

                <button className={styles.button}>
                Sign in
                </button>
            </form>
        </div>
        </>
    )
}