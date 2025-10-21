"use client";

import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { sound, bmg } from "@/lib/sound";

const clamp100 = (n: number) => Math.max(0, Math.min(100, n));
const to01 = (pct: number) => clamp100(pct) / 100;

type Ctx = {
  volumePct: number;
  setVolumePct: (v: number) => void;
  sfxVolumePct: number;
  setSfxVolumePct: (v: number) => void;
  sfx: typeof sound;
  music: typeof bmg;
};

const AudioCtx = createContext<Ctx | null>(null);

export function SoundProvider({ children, initialVolumePct = 50, initialSfxVolumePct = 50, }: { children: React.ReactNode; initialVolumePct?: number; initialSfxVolumePct?: number;}) {
  const [volumePct, setVolumePct] = useState(clamp100(initialVolumePct));
  const [sfxVolumePct, setSfxVolumePct] = useState(clamp100(initialSfxVolumePct));

  useEffect(() => {
    const sfxV = to01(sfxVolumePct);
    Object.values(sound).forEach(h => h.volume(sfxV));

    const musicV = Math.max(0, Math.min(1, to01(volumePct) * 0.6));
    try {
      const playing = bmg.playing();
      if (!playing && musicV > 0) {
        bmg.volume(0);
        const id = bmg.play();
        bmg.fade(0, musicV, 250, id);
      } else {
        const curr = bmg.volume();
        if (Math.abs(curr - musicV) > 0.01) bmg.fade(curr, musicV, 150);
      }
    } catch {}
  }, [volumePct, sfxVolumePct]);

  const value = useMemo(
    () => ({
      volumePct,
      setVolumePct: (v: number) => setVolumePct(clamp100(v)),
      sfxVolumePct,
      setSfxVolumePct: (v: number) => setSfxVolumePct(clamp100(v)),
      sfx: sound,
      music: bmg,
    }),
    [volumePct, sfxVolumePct]
  );

  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>;
}

export function useSound() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useSound must be used within a SoundProvider");
  return ctx;
}
