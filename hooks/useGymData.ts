import { useEffect, useState } from "react";

import { gymService } from "@/services/gymService";
import type {
  Exercise,
  Routine,
  UserProfile,
  WorkoutSummary,
} from "@/types/gym";

export function useGymData() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [summary, setSummary] = useState<WorkoutSummary | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    void Promise.all([
      gymService.getExercises(),
      gymService.getRoutines(),
      gymService.getWeeklySummary(),
      gymService.getProfile(),
    ])
      .then(([nextExercises, nextRoutines, nextSummary, nextProfile]) => {
        if (!active) return;
        setExercises(nextExercises);
        setRoutines(nextRoutines);
        setSummary(nextSummary);
        setProfile(nextProfile);
      })
      .catch(() => {
        if (active) setError("No pudimos cargar tus datos. Inténtalo otra vez.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reloadKey]);

  return {
    exercises,
    routines,
    summary,
    profile,
    loading,
    error,
    reload: () => {
      setLoading(true);
      setError(null);
      setReloadKey((key) => key + 1);
    },
  };
}
