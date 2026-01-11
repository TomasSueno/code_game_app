"use client"

import styles from "../styles/SignUp.module.css"
import { signup } from "../actions/auth"
import { useActionState } from "react"


export default function SignupForm() {
    const [state, action, pending] = useActionState(signup, undefined)

    return (
        <>
        <div className={styles.wrapper}>
            <form action={action} className={styles.form}>
                <h1 className={styles.title}>Registrácia</h1>

                <input
                type="text"
                id="name"
                name="name"
                placeholder="Používateľské meno"
                className={styles.input}
                />
                {state?.errors?.name && <p className={styles.errorSignupMessage}>{state.errors.name}</p>}

                <input
                type="email"
                id="email"
                name="email"
                placeholder="E-mail"
                className={styles.input}
                />
                {state?.errors?.email && <p className={styles.errorSignupMessage}>{state.errors.email}</p>}

                <input
                type="password"
                id="password"
                name="password"
                placeholder="Heslo"
                className={styles.input}
                />
                {state?.errors?.password && (
                    <div className={styles.errorSignupMessage}>
                    <p>Heslo musí:</p>
                    <ul>
                        {state.errors.password.map((error) => (
                        <li key={error}>- {error}</li>
                        ))}
                    </ul>
                    </div>
                )}

                <input
                type="password"
                placeholder="Potvrď heslo"
                className={styles.input}
                />

                <button disabled={pending} type="submit" className={styles.button}>
                Vytvor účet
                </button>
            </form>
        </div>
        </>
    )
}