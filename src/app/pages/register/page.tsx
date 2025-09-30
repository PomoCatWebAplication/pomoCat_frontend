import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function register() {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <h1>PomoCat</h1>
        <Image
          alt="Tomate"
          src="/Tomate_coin.png"
          width={200}
          height={200}
          className={styles.tomato} 
          priority
        />
      </div>

      <div className={styles.card}>
        <form className={styles.form}>
          <input type="text" name="username" id="username_rg" placeholder="Username" />
          <input type="password" name="password" id="password_rg" placeholder="Password" />
          <input type="password" name="conPassword" id="conPassword_rg" placeholder="confirm password" />
          <input type="submit" value="Register" id="register" />
        </form>

        <div className={styles.footer}>
          <p>Already have an account?</p>
          <Link href="/" id="register_lg">Log-in</Link>
        </div>
      </div>
    </div>
  );
}