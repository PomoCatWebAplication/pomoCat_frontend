"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./ItemShop.module.css";
import { getItems, type Item } from "./itemsShop.api";

export default function ItemShop() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    getItems()
      .then((data) => {
        if (!alive) return;
        setItems(data);
      })
      .catch((err) => {
        if (!alive) return;
        setError(err?.message ?? "Error cargando items");
      });
    return () => {
      alive = false;
    };
  }, []);

  if (error) {
    return <div className={styles.itemList}>Error: {error}</div>;
  }

  if (!items) {
    return (
      <div className={styles.itemList}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={styles.card} aria-busy="true">
            <div className={styles.label}><h3>&nbsp;</h3></div>
            <div className={styles.image}>
              <div className={styles.skeletonBox} />
            </div>
            <div className={styles.price}><h4>&nbsp;</h4><p>&nbsp;</p></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.itemList}>
      {items.map((item) => {
        const src =
          item.sprite_path.startsWith("/")
            ? item.sprite_path
            : item.sprite_path.replace(/^(\.\.\/)+public/, "");

        return (
          <div key={item._id} className={styles.card} tabIndex={0}>
            <div className={styles.label}><h3>{item.name}</h3></div>
            <div className={styles.image}>
              <Image
                src={src}
                alt={item.name}
                width={128}
                height={128}
                className={styles.img}
                priority={false}
              />
            </div>
            <div className={styles.price}>
              <h4>{item.type}</h4>
              <p>{item.price}</p>
            </div>
          </div>
        );
      })}
    </div>
    </div>
    
  );
}
