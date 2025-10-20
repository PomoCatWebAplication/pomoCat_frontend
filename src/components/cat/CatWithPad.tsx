"use client";
import Image from "next/image";
import styles from "./CatWithPad.module.css";

type Props = { src: string; alt?: string; size?: number };

export default function CatWithPadClient({ src, alt = "cat", size = 330 }: Props) {
  return (
    <div className={styles.cat}>
      <div className={styles.catWrap} style={{ ["--size" as any]: `${size}px` }}>
        <Image
          src={src}
          alt={alt}
          fill
          priority
          className={styles.catImg}
          sizes="(max-width: 768px) 70vw, 360px"
        />
        <div className={styles.pad} aria-hidden />
      </div>
    </div>
  );
}
