import AsyncStorage from "@react-native-async-storage/async-storage";
import type {
  ActiveWorkout,
  Exercise,
  PersonalRecord,
  Routine,
  RoutineExercise,
  UserProfile,
  WorkoutHistoryEntry,
  WorkoutSummary,
} from "@/types/gym";

const HISTORY_KEY = "@gymtrack/workout-history/v1";
const ACTIVE_WORKOUT_KEY = "@gymtrack/active-workout/v1";
const PERSONAL_RECORDS_KEY = "@gymtrack/personal-records/v1";

const userProfile: UserProfile = {
  firstName: "Alex",
  fullName: "Alex Rivera",
  email: "alex.rivera@email.com",
  weeklyGoal: 4,
  currentStreak: 3,
};

const exercises: Exercise[] = [
  {
    id: "squat",
    name: "Sentadilla con barra",
    muscle: "Piernas",
    equipment: "Barra",
    level: "Intermedio",
  },
  {
    id: "bench",
    name: "Press de banca",
    muscle: "Pecho",
    equipment: "Barra",
    level: "Intermedio",
  },
  {
    id: "row",
    name: "Remo con mancuerna",
    muscle: "Espalda",
    equipment: "Mancuerna",
    level: "Principiante",
  },
  {
    id: "deadlift",
    name: "Peso muerto",
    muscle: "Piernas",
    equipment: "Barra",
    level: "Avanzado",
  },
  {
    id: "shoulder",
    name: "Press militar",
    muscle: "Hombros",
    equipment: "Mancuernas",
    level: "Intermedio",
  },
];

function plan(
  id: string,
  name: string,
  targetReps: number,
  previousWeightKg: number,
  currentWeightKg: number,
  restSeconds = 75,
): RoutineExercise {
  return {
    id,
    name,
    targetSets: 3,
    targetReps,
    previousWeightKg,
    currentWeightKg,
    restSeconds,
  };
}

const routines: Routine[] = [
  {
    id: "upper",
    name: "Tren superior",
    focus: "Pecho · espalda · hombros",
    sessionsPerWeek: 3,
    durationMinutes: 55,
    exercises: 6,
    exerciseDetails: [
      plan("bench", "Press de banca", 8, 45, 47.5, 90),
      plan("row", "Remo con mancuerna", 10, 22.5, 22.5, 60),
      plan("shoulder", "Press militar", 10, 15, 15, 60),
      plan("incline", "Press inclinado", 10, 35, 35, 60),
      plan("pulldown", "Jalón al pecho", 12, 40, 42.5, 60),
      plan("facepull", "Face pull", 15, 15, 15, 45),
    ],
  },
  {
    id: "lower",
    name: "Fuerza de piernas",
    focus: "Cuádriceps · glúteos · core",
    sessionsPerWeek: 2,
    durationMinutes: 48,
    exercises: 5,
    exerciseDetails: [
      plan("squat", "Sentadilla con barra", 8, 70, 72.5, 120),
      plan("deadlift", "Peso muerto rumano", 10, 55, 55, 90),
      plan("lunge", "Zancadas", 10, 16, 16, 60),
      plan("curl", "Curl femoral", 12, 25, 27.5, 60),
      plan("calf", "Elevación de gemelos", 15, 35, 35, 45),
    ],
  },
  {
    id: "full",
    name: "Cuerpo completo",
    focus: "Fuerza general",
    sessionsPerWeek: 3,
    durationMinutes: 60,
    exercises: 7,
    exerciseDetails: [
      plan("full-squat", "Sentadilla goblet", 10, 20, 20, 90),
      plan("full-bench", "Press con mancuernas", 10, 17.5, 17.5, 60),
      plan("full-row", "Remo sentado", 12, 35, 37.5, 60),
      plan("full-shoulder", "Press de hombros", 10, 12.5, 12.5, 60),
      plan("full-hinge", "Peso muerto rumano", 10, 40, 42.5, 90),
      plan("full-lunge", "Zancadas caminando", 10, 12, 12, 60),
      plan("full-core", "Plancha", 12, 0, 0, 45),
    ],
  },
];

function createSampleHistory(): WorkoutHistoryEntry[] {
  const now = Date.now();
  return [
    { id: "sample-1", routineId: "upper", routineName: "Tren superior", startedAt: now - 24 * 60 * 60 * 1000, durationMinutes: 48, volumeKg: 4200, completedSets: 18, totalSets: 18 },
    { id: "sample-2", routineId: "lower", routineName: "Fuerza de piernas", startedAt: now - 3 * 24 * 60 * 60 * 1000, durationMinutes: 52, volumeKg: 3180, completedSets: 15, totalSets: 15 },
    { id: "sample-3", routineId: "full", routineName: "Cuerpo completo", startedAt: now - 5 * 24 * 60 * 60 * 1000, durationMinutes: 45, volumeKg: 2670, completedSets: 21, totalSets: 21 },
  ];
}

function createSampleRecords(): PersonalRecord[] {
  return [
    { exerciseId: "squat", exerciseName: "Sentadilla con barra", weightKg: 95, achievedAt: Date.now() - 12 * 24 * 60 * 60 * 1000 },
    { exerciseId: "bench", exerciseName: "Press de banca", weightKg: 62.5, achievedAt: Date.now() - 8 * 24 * 60 * 60 * 1000 },
    { exerciseId: "deadlift", exerciseName: "Peso muerto", weightKg: 115, achievedAt: Date.now() - 20 * 24 * 60 * 60 * 1000 },
  ];
}

function dateKey(value: number) {
  const date = new Date(value);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

async function getPersonalRecords(): Promise<PersonalRecord[]> {
  const stored = await AsyncStorage.getItem(PERSONAL_RECORDS_KEY);
  if (!stored) return createSampleRecords();
  const parsed: unknown = JSON.parse(stored);
  if (!Array.isArray(parsed)) throw new Error("Los récords guardados no tienen un formato válido.");
  return parsed as PersonalRecord[];
}

async function getWorkoutHistory(): Promise<WorkoutHistoryEntry[]> {
  const stored = await AsyncStorage.getItem(HISTORY_KEY);
  if (!stored) return createSampleHistory();
  const parsed: unknown = JSON.parse(stored);
  if (!Array.isArray(parsed)) throw new Error("El historial guardado no tiene un formato válido.");
  return parsed as WorkoutHistoryEntry[];
}

async function saveWorkoutHistory(history: WorkoutHistoryEntry[]) {
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 100)));
}

export const gymService = {
  async getExercises() {
    return exercises;
  },
  async getRoutines() {
    return routines;
  },
  async getWeeklySummary() {
    const history = await getWorkoutHistory();
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    const recent = history.filter((entry) => entry.startedAt >= weekStart.getTime() && entry.startedAt <= now.getTime());
    const goalDays = new Set(recent.map((entry) => dateKey(entry.startedAt)));
    const dailyVolumesKg = Array.from({ length: 7 }, () => 0);
    recent.forEach((entry) => {
      const mondayIndex = (new Date(entry.startedAt).getDay() + 6) % 7;
      dailyVolumesKg[mondayIndex] += entry.volumeKg;
    });

    return {
      durationMinutes: recent.reduce((sum, entry) => sum + entry.durationMinutes, 0),
      volumeKg: recent.reduce((sum, entry) => sum + entry.volumeKg, 0),
      sessionsThisWeek: recent.length,
      weeklyGoal: userProfile.weeklyGoal,
      history,
      goalDays: Array.from(goalDays),
      dailyVolumesKg,
      personalRecords: await getPersonalRecords(),
    } satisfies WorkoutSummary;
  },
  async getProfile() {
    return userProfile;
  },
  async getActiveWorkout() {
    const stored = await AsyncStorage.getItem(ACTIVE_WORKOUT_KEY);
    return stored ? (JSON.parse(stored) as ActiveWorkout) : null;
  },
  async startWorkout(routine: Routine) {
    const workout: ActiveWorkout = {
      id: `workout-${Date.now()}`,
      routineId: routine.id,
      routineName: routine.name,
      startedAt: Date.now(),
      status: "active",
      pausedAt: null,
      restUntil: null,
      totalPausedSeconds: 0,
      completedSetIds: [],
      currentWeights: Object.fromEntries(
        routine.exerciseDetails.map((exercise) => [exercise.id, exercise.currentWeightKg]),
      ),
    };
    await AsyncStorage.setItem(ACTIVE_WORKOUT_KEY, JSON.stringify(workout));
    return workout;
  },
  async saveActiveWorkout(workout: ActiveWorkout) {
    await AsyncStorage.setItem(ACTIVE_WORKOUT_KEY, JSON.stringify(workout));
  },
  async finishWorkout(workout: ActiveWorkout, routine: Routine, elapsedSeconds: number) {
    const totalSets = routine.exerciseDetails.reduce((sum, exercise) => sum + exercise.targetSets, 0);
    const completedSets = workout.completedSetIds.length;
    const volumeKg = routine.exerciseDetails.reduce((sum, exercise) => {
      const completedForExercise = workout.completedSetIds.filter((setId) => setId.startsWith(`${exercise.id}:`)).length;
      return sum + completedForExercise * exercise.targetReps * (workout.currentWeights[exercise.id] ?? 0);
    }, 0);
    const entry: WorkoutHistoryEntry = {
      id: workout.id,
      routineId: routine.id,
      routineName: routine.name,
      startedAt: workout.startedAt,
      durationMinutes: Math.max(1, Math.round(elapsedSeconds / 60)),
      volumeKg,
      completedSets,
      totalSets,
    };
    const history = await getWorkoutHistory();
    await saveWorkoutHistory([
      entry,
      ...history.filter((item) => !item.id.startsWith("sample-") && item.id !== entry.id),
    ]);
    const records = await getPersonalRecords();
    const nextRecords = [...records];
    routine.exerciseDetails.forEach((exercise) => {
      const completedForExercise = workout.completedSetIds.filter((setId) => setId.startsWith(`${exercise.id}:`)).length;
      if (completedForExercise === 0) return;
      const weightKg = workout.currentWeights[exercise.id] ?? exercise.currentWeightKg;
      const recordIndex = nextRecords.findIndex((record) => record.exerciseId === exercise.id);
      if (recordIndex >= 0 && weightKg > nextRecords[recordIndex].weightKg) {
        nextRecords[recordIndex] = { ...nextRecords[recordIndex], weightKg, achievedAt: Date.now() };
      } else if (recordIndex < 0 && weightKg > 0) {
        nextRecords.push({ exerciseId: exercise.id, exerciseName: exercise.name, weightKg, achievedAt: Date.now() });
      }
    });
    await AsyncStorage.setItem(PERSONAL_RECORDS_KEY, JSON.stringify(nextRecords));
    await AsyncStorage.removeItem(ACTIVE_WORKOUT_KEY);
    return entry;
  },
};
