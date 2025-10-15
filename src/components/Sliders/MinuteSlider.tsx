"use client";
import { useId, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import styles from "./MinutesSlider.module.css";

type Props = {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  onChange?: (v: number) => void;
  label?: string
};

export default function MinutesSlider({
  min = 0,
  max = 100,
  step = 5,
  defaultValue = 30,
  onChange,
  label = "estudio",
}: Props) {
  const [value, setValue] = useState(defaultValue);
  const id = useId();

  const percent = useMemo(() => ((value - min) * 100) / (max - min), [value, min, max]);

  const styleVars = {
    "--value": `${percent}%`,
    "--track-active": "#34d399",
    "--track-rest": "#e2e8f0",
    "--thumb-color": "#94a3b8",
  } as CSSProperties;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setValue(v);
    onChange?.(v);

  };

  return (
    <div className={styles.sliderControl}>
      <label htmlFor={id} className={styles.label}>
        Minutos de {label}: <output className={styles.value}>{value}</output>
      </label>

      <div className={styles.trackWrap}>
        <input
          id={id}
          type="range"
          aria-label="Minutes of study"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          style={styleVars}
          className={styles.range}
        />
      </div>

    </div>
  );
}
