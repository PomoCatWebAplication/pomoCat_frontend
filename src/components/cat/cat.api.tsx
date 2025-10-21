import { cookies } from "next/headers";
import { decodeJwt } from "jose";

export type CatDto = {
  _id: string;
  hat?: string;
  shirt?: string;
  accessory?: string;
  skin: string;
  background: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type ItemDto = {
  _id: string;
  name: string;
  sprite_path: string;
  price: number;
  type: string;
  itemQuality: string;
  isValid: boolean;
  posX?: number;
  posY?: number;
  width?: number;
  height?: number;
};

export default async function GetCat(): Promise<CatDto | null> {
  const cookieStore = cookies();
  const token = (await cookieStore).get("access_token")?.value ?? null;

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

export async function GetItems(cat: CatDto | null): Promise<ItemDto[] | null> {
  if (!cat) return null;

  const hatId = cat.hat ?? null;
  const accId = cat.accessory ?? null;

  if (!hatId && !accId) return [];

  const tasks: Promise<Response>[] = [];
  if (hatId) {
    tasks.push(
      fetch(`http://localhost:4000/items/${hatId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      })
    );
  }
  if (accId) {
    tasks.push(
      fetch(`http://localhost:4000/items/${accId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      })
    );
  }

  const settled = await Promise.allSettled(tasks);
  const items: ItemDto[] = [];

  for (const r of settled) {
    if (r.status === "fulfilled" && r.value.ok) {
      const it = (await r.value.json()) as ItemDto | null;
      if (it) items.push(it);
    }
  }

  return items;
}
