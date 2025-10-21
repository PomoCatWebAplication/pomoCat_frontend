'use client';

import React, { useState, useEffect } from 'react';
import { dailyPlansService, CreateDailyPlanDto, DailyPlan } from '@/lib/services/daily-plans.service';
import { tasksService, Task } from '@/lib/services/tasks.service';
import styles from './DailyPlanModal.module.css';

interface DailyPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedDay?: number;
  selectedHour?: string;
  editingPlan?: DailyPlan | null;
}

export default function DailyPlanModal({
  isOpen,
  onClose,
  onSuccess,
  selectedDay = 0,
  selectedHour = '9:00',
  editingPlan
}: DailyPlanModalProps) {
  const [formData, setFormData] = useState({
    day: selectedDay,
    startTime: '',
    endTime: '',
    note: '',
    taskId: '' // Necesitarás obtener esto de tu lista de tasks
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  useEffect(() => {
    if (isOpen) {
      if (editingPlan) {
        // Modo edición
        setFormData({
          day: editingPlan.day,
          startTime: new Date(editingPlan.startTime).toISOString().slice(0, 16),
          endTime: new Date(editingPlan.endTime).toISOString().slice(0, 16),
          note: editingPlan.note || '',
          taskId: editingPlan.taskId
        });
      } else {
        // Modo creación
        const today = new Date();
        const hour = parseInt(selectedHour.split(':')[0]);
        const startDate = new Date(today.setHours(hour, 0, 0, 0));
        const endDate = new Date(today.setHours(hour + 1, 0, 0, 0));

        setFormData({
          day: selectedDay,
          startTime: startDate.toISOString().slice(0, 16),
          endTime: endDate.toISOString().slice(0, 16),
          note: '',
          taskId: ''
        });
      }
      setError(null);
    }
  }, [isOpen, selectedDay, selectedHour, editingPlan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.taskId) {
        throw new Error('Debes seleccionar una tarea');
      }

      const dto: CreateDailyPlanDto = {
        day: formData.day,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        note: formData.note || undefined,
        taskId: formData.taskId
      };

      if (editingPlan) {
        await dailyPlansService.update(editingPlan.id, {
          day: dto.day,
          startTime: dto.startTime,
          endTime: dto.endTime,
          note: dto.note
        });
      } else {
        await dailyPlansService.create(dto);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el plan');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{editingPlan ? 'Editar Plan' : 'Crear Nuevo Plan'}</h2>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.field}>
            <label htmlFor="day">Día</label>
            <select
              id="day"
              value={formData.day}
              onChange={(e) => setFormData({ ...formData, day: Number(e.target.value) })}
              required
            >
              {days.map((dayName, index) => (
                <option key={index} value={index}>
                  {dayName}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="startTime">Hora de inicio</label>
            <input
              id="startTime"
              type="datetime-local"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="endTime">Hora de fin</label>
            <input
              id="endTime"
              type="datetime-local"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="taskId">Tarea</label>
            <select
              id="taskId"
              value={formData.taskId}
              onChange={(e) => setFormData({ ...formData, taskId: e.target.value })}
              required
            >
              <option value="">Selecciona una tarea</option>
              {/* Aquí deberías cargar tus tasks desde el backend */}
              <option value="task-1">Tarea de ejemplo 1</option>
              <option value="task-2">Tarea de ejemplo 2</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="note">Nota (opcional)</label>
            <textarea
              id="note"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              rows={3}
              placeholder="Añade una nota..."
            />
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Cancelar
            </button>
            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? 'Guardando...' : editingPlan ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}