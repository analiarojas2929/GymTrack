export type Exercise = {
  id: string;
  name: string;
  muscle: string;
  equipment: string;
  level: 'Principiante' | 'Intermedio' | 'Avanzado';
};

export type Routine = {
  id: string;
  name: string;
  focus: string;
  sessionsPerWeek: number;
  durationMinutes: number;
  exercises: number;
};

export type WorkoutSummary = {
  durationMinutes: number;
  volumeKg: number;
  sessionsThisWeek: number;
  weeklyGoal: number;
};