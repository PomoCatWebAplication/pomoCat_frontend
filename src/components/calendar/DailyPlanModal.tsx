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
    startTime: selectedHour,
    endTime: '',
    note: '',
    taskId: ''
  });
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: ''
  });
  const [createNewTask, setCreateNewTask] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  useEffect(() => {
    if (isOpen) {
      loadTasks();
      
      if (editingPlan) {
        setFormData({
          day: editingPlan.day,
          startTime: new Date(editingPlan.startTime).toISOString().slice(0, 16),
          endTime: new Date(editingPlan.endTime).toISOString().slice(0, 16),
          note: editingPlan.note || '',
          taskId: editingPlan.taskId
        });
        setCreateNewTask(false);
      } else {
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
        setNewTask({
          title: '',
          description: '',
          dueDate: startDate.toISOString().split('T')[0] // Fecha en formato YYYY-MM-DD
        });
        setCreateNewTask(true); // Por defecto crear nueva tarea
      }
      setError(null);
    }
  }, [isOpen, selectedDay, selectedHour, editingPlan]);

  const loadTasks = async () => {
    try {
      setLoadingTasks(true);
      const allTasks = await tasksService.getAll();
      setTasks(allTasks);
    } catch (err) {
      console.error('Error loading tasks:', err);
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let taskId = formData.taskId;

      // Si queremos crear una nueva tarea, crearla primero
      if (createNewTask) {
        if (!newTask.title.trim()) {
          throw new Error('El título de la tarea es requerido');
        }

        const createdTask = await tasksService.create({
          title: newTask.title,
          description: newTask.description || undefined,
          dueDate: newTask.dueDate,
          state: 'PENDING' // En mayúsculas
        });
        
        taskId = (createdTask as any)._id || createdTask._id || createdTask.id;
        console.log('Tarea creada:', createdTask);
      } else if (!taskId) {
        throw new Error('Debes seleccionar una tarea');
      }

      const dto: CreateDailyPlanDto = {
        day: formData.day,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        note: formData.note || undefined,
        taskId: taskId
      };

      if (editingPlan) {
        const planId = editingPlan._id || editingPlan.id;
        await dailyPlansService.update(planId, {
          day: dto.day,
          startTime: dto.startTime,
          endTime: dto.endTime,
          note: dto.note
        });
      } else {
        const createdPlan = await dailyPlansService.create(dto);
        console.log('Plan creado:', createdPlan);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error al guardar:', err);
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

          {!editingPlan && (
            <div className={styles.field}>
              <div className={styles.toggleContainer}>
                <label className={styles.toggleLabel}>
                  <input
                    type="checkbox"
                    checked={createNewTask}
                    onChange={(e) => setCreateNewTask(e.target.checked)}
                  />
                  <span>Crear nueva tarea</span>
                </label>
              </div>
            </div>
          )}

          {createNewTask && !editingPlan ? (
            <>
              <div className={styles.field}>
                <label htmlFor="taskTitle">Título de la tarea *</label>
                <input
                  id="taskTitle"
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Ej: Estudiar para examen"
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="taskDescription">Descripción (opcional)</label>
                <textarea
                  id="taskDescription"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  rows={2}
                  placeholder="Detalles adicionales..."
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="taskDueDate">Fecha de vencimiento *</label>
                <input
                  id="taskDueDate"
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  required
                />
              </div>
            </>
          ) : (
            <div className={styles.field}>
              <label htmlFor="taskId">Tarea</label>
              <select
                id="taskId"
                value={formData.taskId}
                onChange={(e) => setFormData({ ...formData, taskId: e.target.value })}
                required={!createNewTask}
                disabled={loadingTasks}
              >
                <option value="">
                  {loadingTasks ? 'Cargando tareas...' : 'Selecciona una tarea'}
                </option>
                {tasks.map((task) => {
                  const taskId = (task as any)._id || task._id || task.id;
                  return (
                    <option key={taskId} value={taskId}>
                      {task.title}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="note">Nota (opcional)</label>
            <textarea
              id="note"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              rows={3}
              placeholder="Añade una nota al plan..."
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