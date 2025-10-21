"use client";
import { Howl } from "howler";

export const sound = {
  meow: new Howl({
    src: ["/vfx/meow.mp3"],
    volume: 0.5,
    preload: true,
    html5: true,
    onloaderror: (id, err) => console.warn("SFX meow load error", err),
    onplayerror: (id, err) => console.warn("SFX meow play error", err),
  }),
  prrr: new Howl({
    src: ["/vfx/prrr.mp3"],
    volume: 0.5,
    preload: true,
    html5: true,
    onloaderror: (id, err) => console.warn("SFX prrr load error", err),
    onplayerror: (id, err) => console.warn("SFX prrr play error", err),
  }),
};

export const bmg = new Howl({
  src: ["/vfx/music2.mp3"],
  volume: 0.3,
  loop: true,
  html5: true,
  onloaderror: (id, err) => console.warn("BGM load error", err),
  onplayerror: (id, err) => console.warn("BGM play error", err),
});
