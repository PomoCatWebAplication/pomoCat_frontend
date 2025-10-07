import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";

export default function Main() {
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
            <h1>12:00</h1>
            <form>
              <button type="button">Short</button>
              <button type="button">Medium</button>
              <button type="button">Long</button>
            </form>

            <button>
                <Image
                  src="/icons/play-solid-full.svg"
                  alt="play"
                  width={20}
                  height={20}
                  className={styles.playIcon}
                />
              </button>

              <div className={styles.settingsController}>


              </div>

          </div>

          <button>
            <Image
              src="/icons/settings.svg"
              alt="add"
              width={20}
              height={20}
              className={styles.addIcon}
            />
            </button>

          <div>

            
          
          </div>
          
        </div>
        
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}
