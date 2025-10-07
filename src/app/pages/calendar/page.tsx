import React from "react";
import styles from "./calendar.module.css";
import Image from "next/image";
import { FaClock, FaCalendarAlt, FaShoppingCart, FaCog } from "react-icons/fa";

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
      <div className={styles.header}>
      <div className={styles.logo}>
        <h1>PomoCat</h1>
        <Image
          alt="Tomate"
          src="/Tomate_coin.png"
          width={50}
          height={50}
          className={styles.tomato} 
          priority
        />
      </div>
        <div className={styles.tomatoBadge}>
          🍉 <span>030</span>
        </div>
      </div>

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

      <nav className={styles.bottomNav}>
        <button className={styles.navButton}><Image alt="Casita" src="\Icons\home.svg" width={20} height={20} className={styles.tomato} priority /></button>
        <button className={styles.navButton}><Image alt="Calendario" src="\Icons\calendar-regular-full.svg" width={20} height={20} className={styles.tomato} priority /></button>
        <button className={styles.navButton}><Image alt="Tienda" src="\Icons\shopping-cart.svg" width={20} height={20} className={styles.tomato} priority /></button>
        <button className={styles.navButton}><Image alt="Settings" src="\Icons\settings.svg" width={20} height={20} className={styles.tomato} priority /></button>
      </nav>
    </div>
  );
}
