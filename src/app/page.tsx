"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { LoginForm } from "@/components/auth/login-form";

export default async function Home() {
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
        <LoginForm />
        <div className={styles.footer}>
          <p>Don&apos;t have an account?</p>
          <Link href="/pages/register" id="register_lg">Register now</Link>
        </div>
      </div>
    </div>
  );
}
