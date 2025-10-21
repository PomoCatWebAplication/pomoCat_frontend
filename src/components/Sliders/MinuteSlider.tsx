"use client";
import { useId, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import styles from "./MinutesSlider.module.css";

type Props = {
  id?: string
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (v: number) => void;
  label?: string;
};

export default function MinutesSlider({
  id,
  min = 0,
  max = 100,
  step = 5,
  value,
  onChange,
  label = "estudio",
}: Props) {
  const percent = useMemo(() => ((value - min) * 100) / (max - min), [value, min, max]);
  const safeId = id ?? `slider-${label.replace(/\s+/g, "-").toLowerCase()}`;

  const styleVars = {
    "--value": `${percent}%`,
    "--track-active": "#34d399",
    "--track-rest": "#e2e8f0",
    "--thumb-color": "#94a3b8",
  } as CSSProperties;

  return (
    <div className={styles.sliderControl}>
      <label htmlFor={id} className={styles.label}>
        Minutes of {label}: <output className={styles.value}>{value}</output>
      </label>

      <div className={styles.trackWrap}>
        <input
          id={id}
          type="range"
          aria-label={`Minutes of ${label}`}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={styleVars}
          className={styles.range}
        />
      </div>
    </div>
  );
}
