"use client"
import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import MinutesSlider from "@/components/MinuteSlider";


export default function Main() {
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
            width={100}
            height={100}
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

      <main className={styles.main}>

        <div className={styles.cat}>
          <Image
            src="/cats/defaultCat.png"
            alt="cat"
            width={700}   
            height={700}
            className={styles.catImg}
            priority
          />
        </div>

        <div className={styles.card}>

          <div className={styles.controller}>
            <div className={styles.timmers}>
              <h1>30 study</h1>
              <h1>15 rest</h1>
            </div>
            <form>
              <button type="button" className={styles.timeBtn} >Short</button>
              <button type="button" className={styles.timeBtn} >Medium</button>
              <button type="button" className={styles.timeBtn} >Long</button>
            </form>

            <button className={styles.timeBtn} >
                <Image
                  src="/icons/play-solid-full.svg"
                  alt="play"
                  width={20}
                  height={20}
                  className={styles.playIcon}
                />
              </button>

          </div>

          <div className={`${styles.buttonRow} ${visible ? styles.close : ""}`}>
            <button
              type="button"
              aria-expanded={visible}
              aria-controls="settings-panel"
              onClick={() => setVisible(v => !v)}
              className={styles.timeBtn}
          >
              <Image
                src="/icons/settings.svg"
                alt="settings"
                width={20}
                height={20}
                className={styles.addIcon}
              />
            </button>
          </div>

          <div
            id="settings-panel"
            className={`${styles.insideSettings} ${visible ? styles.open : ""}`}
          >

            <div className={styles.closeBtn}>
              <button
                type="button"
                onClick={() => setVisible(v => !v)}
                className={styles.closebtnS}
              >
                <Image
                src="/icons/close.svg"
                alt="close"
                width={20}
                height={20}
                />
              </button>
            </div>

            <div className={styles.settingsControl}>

                <MinutesSlider
                  min={1}
                  max={120}
                  step={1}
                  defaultValue={30}
                />

                <MinutesSlider
                  min={1}
                  max={120}
                  step={1}
                  defaultValue={15}
                />

            </div>

            <div className={styles.buttonSettings}>
              <button className={styles.settingsBtn}>
                <Image
                  src="/icons/play-solid-full.svg"
                  alt="Play_with_settings"
                  width={20}
                  height={20}
                />
              </button>
            </div>
            

          </div>
          
        </div>
        
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}
