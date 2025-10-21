"use client";
import { Howl } from "howler";

export const sound = {
  meow: new Howl({
    src: ["/vfx/meow.mp3"],
    volume: 0.3,
    preload: true,
    html5: true,
  }),
  prrr: new Howl({
    src: ["/vfx/prrr.mp3"],
    volume: 0.5,
    preload: true,
    html5: true,
  }),
  cuteCat: new Howl({
    src: ["/vfx/cuteCatMeow.mp3"],
    volume: 0.5,
    preload: true,
    html5: true,
  }),
  meow1: new Howl({
    src: ["/vfx/meow1.mp3"],
    volume: 0.5,
    preload: true,
    html5: true,
  }),
  purring: new Howl({
    src: ["/vfx/purring.mp3"],
    volume: 0.5,
    preload: true,
    html5: true,
  })
};

export const bmg = new Howl({
  src: ["/vfx/music2.mp3"],
  volume: 0.3,
  loop: true,
  html5: true,
});
