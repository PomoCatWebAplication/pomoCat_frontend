"use client"
import { useRouter } from "next/navigation";
import  styles  from "../../app/page.module.css"
import { auth } from "./auth.api";
import { FormEvent, useState } from "react";


export function LoginForm() {
    const router = useRouter()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const setCookie = (name: string, value: string, days = 7) => {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        const sameSite = "Lax";
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=${sameSite}`;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const result = await auth({email, password});
            const token: string | undefined = result?.access_token || result?.token || result?.accessToken;
            if (!token) {
                throw new Error("Token no recibido");
            }
            setCookie("access_token", token, 7);
            router.push("/pages/home")
        } catch (err) {
            setError(err instanceof Error ? err.message : "No se pudo iniciar sesion");
        } finally {
            setLoading(false);
        }

    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
          <input type="email" name="email" id="username_lg" placeholder="E-mail" value={email} onChange={(event) => setEmail(event.target.value)} />
          <input type="password" name="password" id="password_lg" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} />
          <input type="submit" value={loading ? "Loading... " : "Log in" } id="log-in" disabled={loading} />
          {error && <p>{error}</p>}
        </form>
    );
}
