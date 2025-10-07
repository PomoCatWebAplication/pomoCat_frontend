"use client";

import { useState, type CSSProperties } from "react";
import styles from "./page.module.css";

type VolumeKey = "master" | "music" | "sfx";

type LanguageOption = {
  id: "es" | "en";
  label: string;
};

const VOLUME_CONTROLS: { key: VolumeKey; label: string; hint: string }[] = [
  { key: "master", label: "Master", hint: "Controla el volumen general de la app." },
  { key: "music", label: "Música", hint: "Melodías de fondo durante tus sesiones." },
  { key: "sfx", label: "SFX", hint: "Efectos de sonido." },
];

const LANGUAGES: LanguageOption[] = [
  { id: "es", label: "Español" },
  { id: "en", label: "English" },
];

export default function SettingsPage() {
  const [volumes, setVolumes] = useState<Record<VolumeKey, number>>({
    master: 75,
    music: 60,
    sfx: 45,
  });

  const [volumeEnabled, setVolumeEnabled] = useState<Record<VolumeKey, boolean>>({
    master: true,
    music: true,
    sfx: true,
  });

  const [language, setLanguage] = useState<LanguageOption["id"]>("es");

  return (
    <main className={styles.page}>
      <div className={styles.panel}>
        <header className={styles.header}>
          <h1>Configuración</h1>
          <p>Personaliza la forma en que la app suena y te acompaña.</p>
        </header>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <h2>Audio</h2>
            <span className={styles.sectionCaption}>Ajusta cada pista según tu preferencia.</span>
          </div>
          <div className={styles.sliderList}>
            {VOLUME_CONTROLS.map(({ key, label, hint }) => {
              const enabled = volumeEnabled[key];

              return (
                <div key={key} className={styles.sliderItem} data-enabled={enabled}>
                  <div className={styles.sliderLabel}>
                    <strong>{label}</strong>
                    <span>{hint}</span>
                  </div>
                  <div className={styles.sliderControl}>
                    <input
                      aria-label={label}
                      disabled={!enabled}
                      max={100}
                      min={0}
                      onChange={(event) =>
                        setVolumes((prev) => ({ ...prev, [key]: Number(event.target.value) }))
                      }
                      style={{
                        "--value": `${volumes[key]}%`,
                        "--track-active": enabled ? "#34d399" : "#cbd5f5",
                        "--track-rest": enabled ? "#d1fae5" : "#e2e8f0",
                        "--thumb-color": enabled ? "#047857" : "#94a3b8",
                      } as CSSProperties}
                      type="range"
                      value={volumes[key]}
                    />
                  </div>
                  <div className={styles.sliderMeta}>
                    <span className={styles.sliderValue}>{volumes[key]}%</span>
                    <button
                      aria-pressed={enabled}
                      className={styles.sliderToggle}
                      data-active={enabled}
                      onClick={() =>
                        setVolumeEnabled((prev) => ({ ...prev, [key]: !prev[key] }))
                      }
                      type="button"
                    >
                      <span className={styles.srOnly}>
                        {enabled ? "Desactivar" : "Activar"} {label}
                      </span>
                      <span aria-hidden className={styles.sliderToggleTrack}>
                        <span className={styles.sliderToggleThumb} />
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <h2>Idioma</h2>
            <span className={styles.sectionCaption}>Selecciona cómo se muestran los textos.</span>
          </div>
          <div className={styles.languageList}>
            {LANGUAGES.map((option) => (
              <button
                key={option.id}
                className={styles.languageButton}
                data-active={language === option.id}
                onClick={() => setLanguage(option.id)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}