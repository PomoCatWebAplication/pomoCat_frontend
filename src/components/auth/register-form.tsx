"use client";
import { registerUser } from "./auth.api"
import styles from "../../app/pages/register/page.module.css"
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";


export function RegisterForm() {
    
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null> (null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        if (password == confirmPassword) {
            
            try {
                const result = await registerUser({userName, email, password})
                router.push("/");
            } catch (error) {
             setError(error instanceof Error ? error.message: "No se pudo registrar");
            }
            finally {
                setLoading(false)
            }
            
        }
        else {
            setLoading(false)
            setError("Las contraseñas no coinciden")
        }
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <input type="text" name="userName" id="username_rg" placeholder="User name" value={userName} onChange={(event) => setUserName(event.target.value)} />
            <input type="email" name="email" id="email_rg" placeholder="E-mail" value={email} onChange={(event) => setEmail(event.target.value)} />
            <input type="password" name="password" id="password_rg" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} />
            <input type="password" name="con_password" id="con_password_rg" placeholder="Confirm password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
            <input type="submit" value={loading ? "Loading... " : "register" } id="register" disabled={loading} />
            {error && <p>{error}</p>}
        </form>
    )
}