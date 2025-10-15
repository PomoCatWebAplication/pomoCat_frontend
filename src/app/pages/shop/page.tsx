"use client"

import { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import CatWithPad from "@/components/cat/CatWithPad";
import ItemShop from "@/components/items/ItemShop";

export default function SettingsButton() {
  const [visible, setVisible] = useState(false);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.coins}>
          <Image
          src="/Tomate_coin.png"
          alt="coin"
          className={styles.pomos}
          width={40}
          height={40}
          />

          <p>120</p>
        </div>

        <nav className={styles.navigator}>

          <Link href="/pages/home">
            <Image
            src="/icons/home.svg"
            alt="home"
            width={5}
            height={5}
            className={styles.icon}
          />
          </Link>

          <Link href="/pages/calendar">
            <Image
            src="/icons/calendar-regular-full.svg"
            alt="home"
            width={5}
            height={5}
            className={styles.icon}
          />
          </Link>

          <Link href="/pages/shop">
            <Image
            src="/icons/shopping-cart.svg"
            alt="home"
            width={5}
            height={5}
            className={styles.icon}
          />
          </Link>

          <Link href="/pages/settings">
            <Image
            src="/icons/settings.svg"
            alt="home"
            width={5}
            height={5}
            className={styles.icon}
          />
          </Link>
          
        </nav>
      </header>

      <div className={styles.main}>
          <nav className={styles.display_items}>
              <div className={styles.itemsScroll}>
                  <ItemShop/>
              </div>
          </nav>

          <div className={styles.display_cat}>
              <CatWithPad/>
          </div>
      </div>

      <footer className={styles.footer}>

      </footer>

    </div>
  );
}
