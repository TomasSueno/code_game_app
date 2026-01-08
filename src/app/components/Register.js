"use client"

import styles from "../styles/Register.module.css"

export default function Register() {
    return (
        <>
        <div className={styles.wrapper}>
            <form className={styles.form}>
                <h1 className={styles.title}>Register</h1>

                <input
                type="text"
                placeholder="Username"
                className={styles.input}
                />

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

                <input
                type="password"
                placeholder="Confirm password"
                className={styles.input}
                />

                <button className={styles.button}>
                Create account
                </button>
            </form>
        </div>
        </>
    )
}