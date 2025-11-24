// src/lib/auth/me.server.ts
import { decodeJwt } from "jose";
import { cookies } from "next/headers";

export interface UserDto {
  id: string;
  email: string;
  name?: string;
}

export default async function Me(): Promise<UserDto | null> {
  // cookies() AHORA ES ASYNC
  const cookieStore = await cookies();

  const token = cookieStore.get("access_token")?.value ?? null;
  if (!token) return null;

  const payload = decodeJwt(token) as {
    sub?: string;
    userId?: string;
    id?: string;
  };

  const userId = payload.userId ?? payload.id ?? payload.sub ?? null;
  if (!userId) return null;

  const res = await fetch(`http://localhost:4000/auth/users/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = await res.json();
  return Array.isArray(data) ? data[0] : data;
}
