import { cookies } from "next/headers";
import { decodeJwt } from "jose";

export type CatDto = {
  _id: string;
  skin: string;
  background: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export default async function GetCat(): Promise<CatDto | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value ?? null;

  let userId: string | null = null;
  if (token) {
    const payload = decodeJwt(token) as { sub?: string; userId?: string; id?: string };
    userId = payload.userId ?? payload.id ?? payload.sub ?? null;
  }
  if (!userId) return null;

  const res = await fetch(`http://localhost:4000/pet/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to request cat");

  const data = await res.json();
  const cat: CatDto | null = Array.isArray(data) ? (data[0] ?? null) : data;

  return cat;
}
