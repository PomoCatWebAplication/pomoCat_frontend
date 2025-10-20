"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import styles from "./page.module.css";

type Item = {
  _id: string;
  name: string;
  sprite_path: string;
  price: number;
  type: string;
  itemQuality?: string;
};


type Props = {
  itemId: string;
  onClose: () => void;
  userCoins: number;
  userId: string
};

export default function ItemDetailDrawer({ itemId, onClose, userCoins, userId }: Props) {
  const [item, setItem] = useState<Item | null>(null);
  const [owned, setOwned] = useState<boolean>(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const resItem = await fetch(`http://localhost:4000/items/${itemId}`, { credentials:"include", cache:"no-store" });
        if (!resItem.ok) throw new Error("Error cargando item");
        const it: Item = await resItem.json();

        const inventory = await fetch(
            `http://localhost:4000/inventory/user/${userId}/item/${it._id}`, {
                method: "GET",
                credentials:"include",
                cache: "no-store"
            }
        )

        if (!alive) return;
        setItem(it);
        setOwned(inventory.ok)
      } catch (e: any) {
        if (!alive) return;
        setMsg(e?.message ?? "Error cargando detalle");
      }
    })();
    return () => { alive = false; };
  }, [itemId]);


  const action = owned ? "equip" : "buy";
  const onAction = () => {
    setMsg(null);
    startTransition(async () => {
      try {
        if (!item) throw new Error("Falta información del ítem");

        if (action === "buy") {
          const res = await fetch(`http://localhost:4000/shop/purchase/${item._id}/${userId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });
          if (!res.ok) throw new Error("No se pudo comprar");
          setOwned(true);
          setMsg("¡Comprado! Ahora puedes equiparlo.");
          return;
        }

        type ItemType = "HAT" | "SHIRT" | "ACCESSORY" | "SKIN" | "BACKGROUND";
        const t = item.type as ItemType;

        const patch: Record<string, string> = {};
        switch (t) {
          case "HAT":        patch.hat = item._id; break;
          case "SHIRT":      patch.shirt = item._id; break;
          case "ACCESSORY":  patch.accessory = item._id; break;
          case "SKIN":       patch.skin = item.sprite_path; break;  
          case "BACKGROUND": patch.background = item.sprite_path; break;
          default: throw new Error(`Tipo de ítem no soportado: ${item.type}`);
        }

        const res = await fetch(`http://localhost:4000/pet/${userId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(patch),
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || "No se pudo equipar");
        }
        setMsg("¡Equipado!");
      } catch (e: any) {
        setMsg(e?.message ?? "Ocurrió un error");
      }
    });
  };

  const src = item?.sprite_path
    ? (item.sprite_path.startsWith("/") ? item.sprite_path : item.sprite_path.replace(/^(\.\.\/)+public/, ""))
    : "/sprites/placeholder.svg";

  const blocked = !owned && !!item && userCoins < item.price;

  return (
    <div className={styles.drawerBackdrop} onClick={onClose}>
      <div className={styles.drawerCard} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">✕</button>

        {!item ? (
          <p>Cargando…</p>
        ) : (
          <>
            <header style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12}}>
              <h2 style={{fontSize:"1.25rem", fontWeight:600}}>{item.name}</h2>
              <div style={{opacity:.8}}>Tus monedas: {userCoins}</div>
            </header>

            <section style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16}}>
              <div className={styles.imgFrame}>
                <Image 
                src={src} 
                alt={item.name} 
                fill
                sizes="220px"
                className={styles.itemImg}
                priority={false}
                />
              </div>

              <div style={{display:"grid", gap:8}}>
                <p><strong>Tipo:</strong> {item.type}</p>
                {item.itemQuality && <p><strong>Calidad:</strong> {item.itemQuality}</p>}
                <p><strong>Precio:</strong> {item.price} 🍅</p>

                {blocked && <p style={{color:"#f55"}}>No tienes suficientes monedas.</p>}

                <button
                  onClick={onAction}
                  disabled={pending || blocked}
                  style={{ border:0, borderRadius:10, padding:"10px 14px",
                    background: owned ? "#16a34a" : "#2563eb",
                    color:"#fff", cursor: pending ? "wait" : "pointer", opacity: pending ? .7 : 1 }}
                >
                  {pending ? (owned ? "Equipando…" : "Comprando…") : (owned ? "Equipar" : `Comprar por ${item.price} 🍅`)}
                </button>

                {msg && <p style={{marginTop:6}}>{msg}</p>}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
