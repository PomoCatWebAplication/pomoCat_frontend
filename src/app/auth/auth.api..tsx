type LoginPayload = {
    email: string;
    password: string;
};

export async function auth(data: LoginPayload) {
    const user = await fetch(
        "http://localhost:4000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
        }
    );

    if (!user.ok) {
        let message = "Login failed";
        try {
            const err = await user.json();
            if (err?.message) message = Array.isArray(err.message) ? err.message.join(", ") : String(err.message);
        } catch {}
        throw new Error(message);
    }

    return await user.json();
    
}
