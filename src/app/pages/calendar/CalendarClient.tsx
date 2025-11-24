'use client';

import React, { useEffect, useState } from "react";
import styles from "./calendar.module.css";
import Image from "next/image";
import Link from "next/link";
import { dailyPlansService, DailyPlan } from "@/lib/services/daily-plans.service";
import DailyPlanModal from "@/components/calendar/DailyPlanModal";

type Prop = {
  userid: string;
  coins_user: string;
}

export default function CalendarPage({ userid, coins_user }: Prop) {
  const [coins, setCoins] = useState<number>(parseInt(coins_user, 10) || 0); 
  const [dailyPlans, setDailyPlans] = useState<DailyPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ day: number; hour: string }>({ day: 0, hour: '9:00' });
  const [editingPlan, setEditingPlan] = useState<DailyPlan | null>(null);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const hours = [
    "7:00", "8:00", "9:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00", "17:00"
  ];

  useEffect(() => {
    loadDailyPlans();
  }, []);

  const loadDailyPlans = async () => {
    try {
      setLoading(true);
      const plans = await dailyPlansService.getAll();
      setDailyPlans(plans);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading plans');
      console.error('Error loading daily plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPlansForDayAndHour = (dayIndex: number, hour: string): DailyPlan[] => {
    return dailyPlans.filter(plan => {
      if (plan.day !== dayIndex) return false;
      
      const planStart = new Date(plan.startTime);
      const planHour = planStart.getHours();
      const cellHour = parseInt(hour.split(':')[0]);
      
      return planHour === cellHour;
    });
  };

  const handleCellClick = (dayIndex: number, hour: string) => {
    setSelectedCell({ day: dayIndex, hour });
    setEditingPlan(null);
    setIsModalOpen(true);
  };

  const handleEditPlan = (plan: DailyPlan, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  const handleDeletePlan = async (planId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('ID del plan a eliminar:', planId); // DEBUG
    if (confirm('¿Estás seguro de eliminar este plan?')) {
      try {
        await dailyPlansService.delete(planId);
        await loadDailyPlans();
      } catch (err) {
        console.error('Error deleting plan:', err);
        alert('Error al eliminar el plan');
      }
    }
  };

  const handleModalSuccess = () => {
    loadDailyPlans();
  };

  const formatTime = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando calendario...</div>
      </div>
    );
  }

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
          <p>{coins}</p>
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
              className={styles.icon}
            />
          </Link>
        </nav>
      </header>

      <h2 className={styles.title}>Calendar</h2>

      {error && (
        <div className={styles.error}>
          Error: {error}
          <button onClick={loadDailyPlans}>Reintentar</button>
        </div>
      )}

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
              {days.map((day, dayIndex) => {
                const plans = getPlansForDayAndHour(dayIndex, hour);
                
                return (
                  <div 
                    key={day + hour} 
                    className={styles.cell}
                    onClick={() => handleCellClick(dayIndex, hour)}
                  >
                    {plans.map((plan) => (
                      <div 
                        key={plan._id} 
                        className={styles.task}
                        onClick={(e) => handleEditPlan(plan, e)}
                      >
                        <div className={styles.taskContent}>
                          <span className={styles.taskTime}>
                            {formatTime(plan.startTime)} - {formatTime(plan.endTime)}
                          </span>
                          {plan.note && (
                            <span className={styles.taskNote}>{plan.note}</span>
                          )}
                        </div>
                        <button
                          className={styles.deleteBtn}
                          onClick={(e) => handleDeletePlan(plan._id, e)}
                          title="Eliminar"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <button 
        className={styles.addPlanBtn}
        onClick={() => {
          setEditingPlan(null);
          setIsModalOpen(true);
        }}
        title="Añadir nuevo plan"
      >
        +
      </button>

      <DailyPlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        selectedDay={selectedCell.day}
        selectedHour={selectedCell.hour}
        editingPlan={editingPlan}
      />
    </div>
  );
}
