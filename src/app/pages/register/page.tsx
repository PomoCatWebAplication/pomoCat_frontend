"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { RegisterForm } from "@/components/auth/register-form";

export default function Register() {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <h1>PomoCat</h1>
        <Image
          alt="Tomate"
          src="/Tomate_coin.png"
          width={100}
          height={100}
          className={styles.tomato} 
          priority
        />
      </div>

      <div className={styles.card}>
            <RegisterForm/>
        <div className={styles.footer}>
          <p>Already have an account?</p>
          <Link href="/" id="register_lg">Log-in</Link>
        </div>
      </div>
    </div>
  );
}