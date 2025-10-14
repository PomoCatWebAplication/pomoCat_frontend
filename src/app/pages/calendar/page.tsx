import React from "react";
import styles from "./calendar.module.css";
import Image from "next/image";
import Link from "next/link";


export default function CalendarPage() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const hours = [
    "7:00","8:00","9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"
  ];

  const schedule: Record<string, Record<string, string[]>> = {
    Monday: { "7:00": ["Gym"], "10:00": ["Trabajo Estructuras"], "11:00": [], "20:00": ["Aprender NextJS"] },
    Tuesday: { "8:00": ["Estudiar Contabilidad"] },
    Wednesday: { "9:00": ["Doctor"], "11:00": ["Avanzar Proyecto Plataformas"] },
    Thursday: { "13:00": [] },
    Friday: { "10:00": ["Furbo"] },
    Saturday: { "15:00": ["Salida Con Amigos"] },
    Sunday: { "12:00": ["Almuerzo Con La Familia"] },
  };
  
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.coins}>
          <Image
          src="/Tomate_coin.png"
          alt="coin"
          className={styles.pomos}
          width={20}
          height={20}
          />

          <p>120</p>
        </div>

        <nav className={styles.navigator}>

          <Link href="/pages/home">
            <Image
            src="/icons/home.svg"
            alt="home"
            width={5}
            height={5}
            className={styles.icon}
          />
          </Link>

          <Link href="/pages/calendar">
            <Image
            src="/icons/calendar-regular-full.svg"
            alt="home"
            width={5}
            height={5}
            className={styles.icon}
          />
          </Link>

          <Link href="/pages/shop">
            <Image
            src="/icons/shopping-cart.svg"
            alt="home"
            width={5}
            height={5}
            className={styles.icon}
          />
          </Link>

          <Link href="/pages/settings">
            <Image
            src="/icons/settings.svg"
            alt="home"
            width={5}
            height={5}
            className={styles.icon}
          />
          </Link>
          
        </nav>
      </header>

      <h2 className={styles.title}>Calendar</h2>

      <div className={styles.calendarWrapper}>
        <div className={styles.calendar}>
          <div className={styles.headerRow}>
            <div className={styles.hourCell}></div>
            {days.map((day) => (
              <div key={day} className={styles.dayHeader}>{day}</div>
            ))}
          </div>

          {hours.map((hour) => (
            <div key={hour} className={styles.row}>
              <div className={styles.hourCell}>{hour}</div>
              {days.map((day) => (
                <div key={day + hour} className={styles.cell}>
                  {schedule[day]?.[hour]?.map((task, i) => (
                    <div key={i} className={styles.task}>{task}</div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

     
    </div>
  );
}
