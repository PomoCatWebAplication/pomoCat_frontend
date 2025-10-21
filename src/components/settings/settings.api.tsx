import Me from "../auth/me.api";

type Settings = {
    _id: string;
    userId: string;
    musicVolume: number;
    sfxVolume: number;
    lenguage: "es" | "en";
    createdAt: string;
    updatedAt: string;
    __v: number;
}


export default async function getSettings() {
  const user = await Me();

    if (!user) throw new Error("Usuario no autenticado");
    const userId = user._id;

  const res = await fetch(`http://localhost:4000/settings/user/${userId}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch settings");
  }
  return res.json() as Promise<Settings>;
}