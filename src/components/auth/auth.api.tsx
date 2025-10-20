import { cookies } from "next/headers";
import { decodeJwt } from "jose";

type LoginPayload = {
    email: string;
    password: string;
};

type RegisterPayload = {
    userName: string;
    email: string;
    password: string;
}

export type UserDto = {
  _id: string,
userName: string,
email: string,
coins: string,
role: string,
streak: string,
__v: string,
};

export async function registerUser(user:RegisterPayload) {
    const newUser = await fetch(
        "http://localhost:4000/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        }
    );

    if (!newUser.ok) {
        let message = "Register failed";
        try {
            const err = await newUser.json();
            if (err?.message ) {
                message = Array.isArray(err.message) ? err.message.join(", "): String(err.message);
            }
        }
        catch {

        }
        throw new Error(message);
    }

    const created = await newUser.json()
    const id = created?._id ?? created?.id ?? created?.user?._id ?? created?.user?.id;

    const createUserCat = await fetch(
        `http://localhost:4000/pet/new/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        }
    )

    if (!createUserCat.ok) {
        let message = "Failed to register"
        const err = await createUserCat.json();
        if (err?.message) {
            message = Array.isArray(err.message) ? err.message.join(", "): String(err.message);
        }
        throw new Error(message);
    }

    const createdUserSettings = await fetch (
        `http://localhost:4000/settings/user/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        }
    )

    if (!createdUserSettings.ok) {
        let message = "Failed to register"
        const err = await createdUserSettings.json();
        if (err?.message) {
            message = Array.isArray(err.message) ? err.message.join(", "): String(err.message);
        }
        throw new Error(message);
    }

    return created

}


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


export default async function Me() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value ?? null;

  let userId: string | null = null;
  if (token) {
    const payload = decodeJwt(token) as { sub?: string; userId?: string; id?: string };
    userId = payload.userId ?? payload.id ?? payload.sub ?? null;
  }
  if (!userId) return null;

  const user = await fetch(
    `http://localhost:4000/auth/users/${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
    }
  )

  const data = await user.json();
  const res: UserDto | null = Array.isArray(data) ? (data[0] ?? null) : data;

  return res;

}