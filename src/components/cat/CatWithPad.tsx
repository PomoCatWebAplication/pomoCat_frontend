"use client";
import Image from "next/image";
import styles from "./CatWithPad.module.css";
import { CSSProperties } from "react";


type Props = { src: string; alt?: string; size?: number };

type Item = {
  _id: string;
  name: string;
  sprite_path: string;
  price: number;
  type: string;
  itemQuality: string;
  isValid: boolean;
  posX?: number;
  posY?: number;
  width?: number;
  height?: number;
};

const BASE = 360;


export default function CatWithPadClient(
  { src, alt = "cat", size = 330, hat, accessory }: Props & { hat?: Item; accessory?: Item }
) {
  const scale = size / BASE;

  const hatStyle: CSSProperties = {
    ["--x" as any]: `${(hat?.posX ?? 0) * scale}px`,
    ["--y" as any]: `${(hat?.posY ?? 0) * scale}px`,
  };

  const accStyle: CSSProperties = {
    ["--x" as any]: `${(accessory?.posX ?? 0) * scale}px`,
    ["--y" as any]: `${(accessory?.posY ?? 0) * scale}px`,
  };

  return (
    <div className={styles.cat}>
      <div className={styles.catWrap} style={{ ["--size" as any]: `${size}px` }}>
        <div className={styles.catHat} style={hatStyle}>
          <Image
            src={hat?.sprite_path || "/items/empty.png"}
            alt={hat?.name || "hat"}
            priority
            className={styles.itemImg}
            width={(hat?.width ?? 0) * scale}
            height={(hat?.height ?? 0) * scale}
            hidden={!(hat?.sprite_path)}
          />
        </div>

        <div className={styles.catAccessory} style={accStyle}>
          <Image
            src={accessory?.sprite_path || "/items/empty.png"}
            alt={accessory?.name || "accessory"}
            priority
            className={styles.itemImg}
            width={(accessory?.width ?? 0) * scale}
            height={(accessory?.height ?? 0) * scale}
            hidden={!(accessory?.sprite_path)}
          />
        </div>

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
