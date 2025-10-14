"use client"

import { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function SettingsButton() {
  const [visible, setVisible] = useState(false);

  return (
    <div className="container">
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

    

    </div>

    
  );
}
