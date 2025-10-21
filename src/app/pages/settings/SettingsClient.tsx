"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./page.module.css";
import { useSound } from "@/context/soundContext";

type VolumeKey = "music" | "sfx";

type Props = {
  userCoins: string;
  userId: string;
  propSetVolume?: number;
  propSetVfx?: number;
};

type LanguageOption = { id: "es" | "en"; label: string };

const VOLUME_CONTROLS: { key: VolumeKey; label: string; hint: string }[] = [
  { key: "music", label: "Música", hint: "Melodías de fondo durante tus sesiones." },
  { key: "sfx", label: "SFX", hint: "Efectos de sonido." },
];

const LANGUAGES: LanguageOption[] = [
  { id: "es", label: "Español" },
  { id: "en", label: "English" },
];

export default function SettingsPage({ userCoins, propSetVolume, propSetVfx, userId }: Props) {
  const { setVolumePct: setVolume, setSfxVolumePct: setSfxVolume } = useSound();

  const [volumes, setVolumes] = useState<Record<VolumeKey, number>>({
    music: propSetVolume ?? 60,
    sfx: propSetVfx ?? 45,
  });

  const [volumeEnabled, setVolumeEnabled] = useState<Record<VolumeKey, boolean>>({
    music: true,
    sfx: true,
  });

  const [language, setLanguage] = useState<LanguageOption["id"]>("es");

  const applyVolumeChanges = useCallback((key: VolumeKey, value: number) => {
    if (key === "sfx") setSfxVolume(value);
    else setVolume(value);
  }, [setSfxVolume, setVolume]);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstRenderRef = useRef(true);

  const persist = useCallback(async (musicPct: number, sfxPct: number) => {
    try {
      await fetch(`http://localhost:4000/settings/user/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          musicVolume: musicPct,
          sfxVolume: sfxPct,
        }),
      });
    } catch {}
  }, []);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const musicOut = volumeEnabled.music ? volumes.music : 0;
    const sfxOut = volumeEnabled.sfx ? volumes.sfx : 0;
    debounceRef.current = setTimeout(() => {
      persist(musicOut, sfxOut);
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [volumes, volumeEnabled, persist]);

  return (
    <main className={styles.page}>
      <header className={styles.topBar}>
        <div className={styles.coins}>
          <Image src="/coin.png" alt="coin" className={styles.pomos} width={20} height={20} />
          <p>{userCoins}</p>
        </div>

        <nav className={styles.navigator}>
          <Link href="/pages/home">
            <Image src="/icons/home.svg" alt="home" width={5} height={5} className={styles.icon} />
          </Link>
          <Link href="/pages/calendar">
            <Image src="/icons/calendar-regular-full.svg" alt="calendar" width={5} height={5} className={styles.icon} />
          </Link>
          <Link href="/pages/shop">
            <Image src="/icons/shopping-cart.svg" alt="shop" width={5} height={5} className={styles.icon} />
          </Link>
          <Link href="/pages/settings">
            <Image src="/icons/settings.svg" alt="settings" width={5} height={5} className={styles.icon} />
          </Link>
        </nav>
      </header>

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
              const value = volumes[key];

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
                      value={value}
                      type="range"
                      onChange={(e) => {
                        const next = Number(e.target.value);
                        setVolumes((prev) => ({ ...prev, [key]: next }));
                        applyVolumeChanges(key, enabled ? next : 0);
                      }}
                      style={
                        {
                          ["--value" as any]: `${value}%`,
                          ["--track-active" as any]: enabled ? "#34d399" : "#cbd5f5",
                          ["--track-rest" as any]: enabled ? "#d1fae5" : "#e2e8f0",
                          ["--thumb-color" as any]: enabled ? "#047857" : "#94a3b8",
                        } as CSSProperties
                      }
                    />
                  </div>

                  <div className={styles.sliderMeta}>
                    <span className={styles.sliderValue}>{value}%</span>
                    <button
                      type="button"
                      aria-pressed={enabled}
                      className={styles.sliderToggle}
                      data-active={enabled}
                      onClick={() => {
                        setVolumeEnabled((prev) => {
                          const nextEnabled = !prev[key];
                          const nextState = { ...prev, [key]: nextEnabled };
                          const out = nextEnabled ? volumes[key] : 0;
                          applyVolumeChanges(key, out);
                          return nextState;
                        });
                      }}
                    >
                      <span className={styles.srOnly}>{enabled ? "Desactivar" : "Activar"} {label}</span>
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
