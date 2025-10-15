"use client";
import Image from "next/image";
import styles from "./CatWithPad.module.css";

type Props = {
  src?: string;
  alt?: string;
  size?: number; // tamaño base del contenedor (px)
};

export default function CatWithPad({
  src = "/cats/defaultCat.png",
  alt = "cat",
  size = 360,
}: Props) {
  return (
    <div className={styles.cat}>
      <div className={styles.catWrap} style={{ "--size": `${size}px` } as React.CSSProperties}>
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
