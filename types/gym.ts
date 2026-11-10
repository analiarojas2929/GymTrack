export type Exercise = {
  id: string;
  name: string;
  muscle: string;
  equipment: string;
  level: "Principiante" | "Intermedio" | "Avanzado";
};

export type RoutineExercise = {
  id: string;
  name: string;
  targetSets: number;
  targetReps: number;
  previousWeightKg: number;
  currentWeightKg: number;
  restSeconds: number;
};

export type Routine = {
  id: string;
  name: string;
  focus: string;
  sessionsPerWeek: number;
  durationMinutes: number;
  exercises: number;
  exerciseDetails: RoutineExercise[];
};

export type WorkoutSummary = {
  durationMinutes: number;
  volumeKg: number;
  sessionsThisWeek: number;
  weeklyGoal: number;
  history: WorkoutHistoryEntry[];
  goalDays: string[];
  dailyVolumesKg: number[];
  personalRecords: PersonalRecord[];
};

export type PersonalRecord = {
  exerciseId: string;
  exerciseName: string;
  weightKg: number;
  achievedAt: number;
};

export type UserProfile = {
  firstName: string;
  fullName: string;
  email: string;
  weeklyGoal: number;
  currentStreak: number;
};

export type ActiveWorkout = {
  id: string;
  routineId: string;
  routineName: string;
  startedAt: number;
  status: "active" | "paused";
  pausedAt: number | null;
  restUntil: number | null;
  totalPausedSeconds: number;
  completedSetIds: string[];
  currentWeights: Record<string, number>;
};

export type WorkoutHistoryEntry = {
  id: string;
  routineId: string;
  routineName: string;
  startedAt: number;
  durationMinutes: number;
  volumeKg: number;
  completedSets: number;
  totalSets: number;
};
