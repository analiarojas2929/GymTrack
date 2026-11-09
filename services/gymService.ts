import type { Exercise, Routine, WorkoutSummary } from '@/types/gym';

const exercises: Exercise[] = [
  { id: 'squat', name: 'Sentadilla con barra', muscle: 'Piernas', equipment: 'Barra', level: 'Intermedio' },
  { id: 'bench', name: 'Press de banca', muscle: 'Pecho', equipment: 'Barra', level: 'Intermedio' },
  { id: 'row', name: 'Remo con mancuerna', muscle: 'Espalda', equipment: 'Mancuerna', level: 'Principiante' },
  { id: 'deadlift', name: 'Peso muerto', muscle: 'Piernas', equipment: 'Barra', level: 'Avanzado' },
  { id: 'shoulder', name: 'Press militar', muscle: 'Hombros', equipment: 'Mancuernas', level: 'Intermedio' },
];

const routines: Routine[] = [
  { id: 'upper', name: 'Tren superior', focus: 'Pecho · espalda · hombros', sessionsPerWeek: 3, durationMinutes: 55, exercises: 6 },
  { id: 'lower', name: 'Fuerza de piernas', focus: 'Cuádriceps · glúteos · core', sessionsPerWeek: 2, durationMinutes: 48, exercises: 5 },
  { id: 'full', name: 'Cuerpo completo', focus: 'Fuerza general', sessionsPerWeek: 3, durationMinutes: 60, exercises: 7 },
];

const weeklySummary: WorkoutSummary = {
  durationMinutes: 185,
  volumeKg: 8420,
  sessionsThisWeek: 3,
  weeklyGoal: 4,
};

export const gymService = {
  async getExercises() {
    return exercises;
  },
  async getRoutines() {
    return routines;
  },
  async getWeeklySummary() {
    return weeklySummary;
  },
};