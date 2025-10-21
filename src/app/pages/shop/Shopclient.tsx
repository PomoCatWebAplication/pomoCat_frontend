"use client";

import { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import CatWithPad from "@/components/cat/CatWithPad";
import ItemShop from "@/components/items/ItemShop";
import ItemDetailDrawer from "./ItemDetailDrawer";


type Props = { catSrc: string; userCoins: string, userId: string };

export default function ShopClient({ catSrc, userCoins, userId }: Props) {
  const search = useSearchParams();
  const router = useRouter();
  const selectedId = useMemo(() => search.get("item"), [search]);

  const closeDrawer = () => router.push("/pages/shop", { scroll: false });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.coins}>
          <Image src="/coin.png" alt="coin" className={styles.pomos} width={40} height={40}/>
          <p>{userCoins}</p>
        </div>
        <nav className={styles.navigator}>
          <Link href="/pages/home"><Image src="/icons/home.svg" alt="home" width={5} height={5} className={styles.icon}/></Link>
          <Link href="/pages/calendar"><Image src="/icons/calendar-regular-full.svg" alt="cal" width={5} height={5} className={styles.icon}/></Link>
          <Link href="/pages/shop"><Image src="/icons/shopping-cart.svg" alt="shop" width={5} height={5} className={styles.icon}/></Link>
          <Link href="/pages/settings"><Image src="/icons/settings.svg" alt="set" width={5} height={5} className={styles.icon}/></Link>
        </nav>
      </header>

      <div className={styles.main}>
        <nav className={styles.display_items}>
          <div className={styles.itemsScroll}><ItemShop /></div>
        </nav>
        <div className={styles.display_cat}><CatWithPad src={catSrc} /></div>
      </div>

      {selectedId && (
        <ItemDetailDrawer
          itemId={selectedId}
          onClose={closeDrawer}
          userCoins={Number(userCoins)}
          userId={userId}
        />
      )}

      <footer className={styles.footer} />
    </div>
  );
}
