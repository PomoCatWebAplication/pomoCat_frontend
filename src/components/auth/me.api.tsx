import { decodeJwt } from "jose";
import { cookies } from "next/headers";
import { UserDto } from "./auth.api";


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