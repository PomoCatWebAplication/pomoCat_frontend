export type Item = {
  _id: string;
  name: string;
  sprite_path: string;
  price: number;
  type: string;
  itemQuality: string;
};

const API_BASE = "http://localhost:4000";

export async function getItems(): Promise<Item[]> {
  const res = await fetch(`${API_BASE}/items/all`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function getItemById(id: string): Promise<Item> {
  const res = await fetch(`http://localhost:4000/items/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudo cargar el item");
  return res.json();
}