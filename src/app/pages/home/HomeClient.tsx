"use client";

import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";
import { use, useCallback, useEffect, useRef, useState } from "react";
import MinutesSlider from "@/components/Sliders/MinuteSlider";
import CatWithPadClient from "@/components/cat/CatWithPad";
import { useSound } from "@/context/soundContext";

type Props = { catSrc: string; coins_user: string, userId: string };
type Phase = "study" | "rest";

const ms = (min: number) => min * 60 * 1000;

export const formatMMSS = (msv: number) => {
  const total = Math.ceil(msv / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

export default function HomeClient({ catSrc, coins_user, userId }: Props) {
  const sfx = useSound().sfx;
  const music = useSound().music;

  const [coins, setCoins] = useState<number>(parseInt(coins_user, 10) || 0);

  const [tasks, setTasks] = useState<string[]>([]);
  const [newTask, setNewTask] = useState<string>("");

  const [visible, setVisible] = useState(false);
  const [study, setStudy] = useState<number>(30);
  const [rest, setRest] = useState<number>(10);
  const [session, setSession] = useState(false);

  const [studyms, setStudyms] = useState<number>(ms(study));
  const [restms, setRestms] = useState<number>(ms(rest));

  const [isPause, setPause] = useState<boolean>(false);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>("study");
  const [timeLeft, setTimeLeft] = useState(ms(study));
  const [loop, setLoop] = useState(0);

  const pauseref = useRef(isPause);
  const phaseref = useRef<Phase>(phase);

  const endAtRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const addTask = (task: string) => {
    setTasks((prevTasks) => [...prevTasks, task]);
    clearTextInput();
  };

  const addCoins = useCallback(async () => {
    try {
      await fetch(`http://localhost:4000/auth/sum-coins/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coins: 10 + loop * 50 }),
      });
    } catch (_) {}
  }, [userId, loop]);

  const removeTaskAndAddCoins = (index: number) => {
    setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
    void addCoins();
    setCoins((prevCoins) => prevCoins + 10 + loop * 50);
  };

  const removeAllTasks = () => {
    setTasks([]);
  };

  const clearTextInput = () => {
    setNewTask("");
  };


  useEffect(() => {
    setStudyms(ms(study));
  }, [study]);

  useEffect(() => {
    setRestms(ms(rest));
  }, [rest]);

  useEffect(() => {
    pauseref.current = isPause;
  }, [isPause]);

  useEffect(() => {
    phaseref.current = phase;
  }, [phase]);

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const scheduleNextPhase = useCallback(
    (next: Phase) => {
      setPhase(next);
      phaseref.current = next;
      const duration = next === "study" ? studyms : restms;
      endAtRef.current = Date.now() + duration;
      setTimeLeft(duration);
    },
    [studyms, restms]
  );

  const tick = useCallback(() => {
    if (pauseref.current) return;
    if (endAtRef.current === null) return;
    const remaining = Math.max(0, endAtRef.current - Date.now());
    setTimeLeft(remaining);
    if (remaining === 0) {
      setLoop((l) => l + 1);
      const wasPhase = phaseref.current;
      const next: Phase = wasPhase === "study" ? "rest" : "study";
      scheduleNextPhase(next);
    }
  }, [scheduleNextPhase]);

  useEffect(() => {
    return () => clear();
  }, [clear]);

  const start = useCallback(
    (studyV: number, restV: number) => {
      clear();
      const localStudyms = ms(studyV);
      const localRestms = ms(restV);
      setStudyms(localStudyms);
      setRestms(localRestms);
      setPhase("study");
      phaseref.current = "study";
      setRunning(true);
      setPause(false);
      pauseref.current = false;
      setLoop(0);
      scheduleNextPhase("study");
      endAtRef.current = Date.now() + localStudyms;
      setTimeLeft(localStudyms);
      try {
        if (!music.playing()) music.play();
      } catch {}
      tick();
      timerRef.current = setInterval(tick, 1000);
    },
    [clear, tick, music, scheduleNextPhase]
  );

  const pause = useCallback(() => {
    if (!running) return;
    setPause(true);
  }, [running]);

  const resume = useCallback(() => {
    if (!running) return;
    setPause(false);
    tick();
  }, [running, tick]);

  const stop = useCallback(() => {
    clear();
    endAtRef.current = null;
    setPause(false);
    setRunning(false);
    setTimeLeft(0);
  }, [clear]);

  function Short() {
    setRest(5);
    setStudy(25);
  }

  function Medium() {
    setRest(10);
    setStudy(30);
  }

  function Long() {
    setRest(10);
    setStudy(45);
  }

  function handleStart() {
    setSession(true);
    setVisible(false);
    sfx.meow.play();
    start(study, rest);
  }

  function handleStop() {
    setSession(false);
    setPause(false);
    sfx.meow.play();
    stop();
    removeAllTasks();
  }

  function handlePause() {
    sfx.meow.play();
    pause();
  }

  function handleResume() {
    sfx.meow.play();
    resume();
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.coins}>
          <Image src="/coin.png" alt="coin" className={styles.pomos} width={40} height={40} />
          <p>{coins}</p>
        </div>

        <nav className={styles.navigator}>
          <Link href="/pages/home">
            <Image 
            src="/icons/home.svg" 
            alt="home" 
            width={100} 
            height={100} 
            className={styles.icon} 
            />
          </Link>
          <Link href="/pages/calendar">
            <Image 
            src="/icons/calendar-regular-full.svg" 
            alt="calendar" 
            width={5} 
            height={5} 
            className={styles.icon} 
            />
          </Link>
          <Link href="/pages/shop">
            <Image 
            src="/icons/shopping-cart.svg" 
            alt="shop" 
            width={5} 
            height={5} 
            className={styles.icon} 
            />
          </Link>
          <Link href="/pages/settings">
            <Image 
            src="/icons/settings.svg" 
            alt="settings" 
            width={5} 
            height={5} 
            className={styles.icon} />
          </Link>
        </nav>
      </header>

      <main className={styles.main}>
        <div className={styles.cat}>
          <CatWithPadClient src={catSrc} size={330} />
        </div>

        <section className={styles.right}>
          <div className={styles.card}>
            <div className={styles.controller}>
              <div className={styles.timmers}>
                <div className={`${styles.session} ${session ? styles.open : ""}`}>
                  <h1>{phase == "study" ? "Study" : "Rest"}</h1>
                  <h2>{formatMMSS(timeLeft)}</h2>
                </div>

                <div className={`${styles.inside_timmers} ${session ? styles.close : ""}`}>
                  <h1>Study</h1>
                  <h2>{study} min</h2>
                </div>

                <div className={`${styles.inside_timmers} ${session ? styles.close : ""}`}>
                  <h1>Rest</h1>
                  <h2>{rest} min</h2>
                </div>
              </div>

              <form className={`${styles.buttons} ${session ? styles.close : ""}`}>
                <button type="button" className={styles.timeBtn} onClick={Short}>
                  Short
                </button>
                <button type="button" className={styles.timeBtn} onClick={Medium}>
                  Medium
                </button>
                <button type="button" className={styles.timeBtn} onClick={Long}>
                  Long
                </button>
              </form>

              <button className={`${styles.timeBtn} ${session ? styles.open : ""}`} onClick={handleStart}>
                <Image src="/icons/play-solid-full.svg" alt="play" width={20} height={20} className={styles.playIcon} />
              </button>

              <div className={`${styles.buttonsWhenTimmer} ${session ? styles.open : ""}`}>
                <button className={`${styles.stopButton} ${session ? styles.open : ""}`} onClick={handleStop}>
                  <Image src="/icons/stop.svg" alt="stop" width={20} height={20} />
                </button>

                <button className={`${styles.stopButton} ${session && !isPause ? styles.open : ""}`} onClick={handlePause}>
                  <Image src="/icons/pause.svg" alt="stop" width={20} height={20} />
                </button>

                <button className={`${styles.stopButton} ${session && isPause ? styles.open : ""}`} onClick={handleResume}>
                  <Image src="/icons/play-solid-full.svg" alt="stop" width={20} height={20} />
                </button>
              </div>
            </div>

            <div className={`${styles.buttonRow} ${visible || session ? styles.close : ""}`}>
              <button
                type="button"
                aria-expanded={visible}
                aria-controls="settings-panel"
                onClick={() => setVisible((v) => !v)}
                className={styles.timeBtn}
              >
                <Image src="/icons/settings.svg" alt="settings" width={20} height={20} className={styles.addIcon} />
              </button>
            </div>

            <div id="settings-panel" className={`${styles.insideSettings} ${visible && !session ? styles.open : ""}`}>
              <div className={styles.closeBtn}>
                <button type="button" onClick={() => setVisible((v) => !v)} className={styles.closebtnS}>
                  <Image src="/icons/close.svg" alt="close" width={20} height={20} />
                </button>
              </div>

              <div className={styles.settingsControl}>
                <MinutesSlider min={1} max={120} step={1} label="study" value={study} onChange={setStudy} />
                <MinutesSlider min={1} max={120} step={1} label="rest" value={rest} onChange={setRest} />
              </div>
            </div>

            <div className={`${styles.secondCard} ${session ? styles.open : ""}`}>
              <h2>Tasks</h2>

              <div className={styles.taskInput}>
                <input type="text" placeholder="Task name" value={newTask} onChange={(e) => setNewTask(e.target.value)} />
                <button onClick={() => addTask(newTask)}>Add</button>
              </div>

              <ul>
                {tasks.map((task, index) => (
                  <li key={index}>{task} <input type="checkbox" name={`check-${index}`} id={`check-${index}`} onChange={() => removeTaskAndAddCoins(index)} /></li>
                ))}
              </ul>

            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
}
