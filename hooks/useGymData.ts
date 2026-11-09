import { useEffect, useState } from "react";

import { gymService } from "@/services/gymService";
import type { Exercise, Routine, WorkoutSummary } from "@/types/gym";

export function useGymData() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [summary, setSummary] = useState<WorkoutSummary | null>(null);

  useEffect(() => {
    void Promise.all([
      gymService.getExercises(),
      gymService.getRoutines(),
      gymService.getWeeklySummary(),
    ]).then(([nextExercises, nextRoutines, nextSummary]) => {
      setExercises(nextExercises);
      setRoutines(nextRoutines);
      setSummary(nextSummary);
    });
  }, []);

  return { exercises, routines, summary };
}
