import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";

import {
  ActionButton,
  AppScreen,
  AppText,
  EmptyState,
  ScreenHeading,
  SkeletonBlock,
  Surface,
} from "@/components/ui";
import { palette, spacing } from "@/constants/theme";
import { gymService } from "@/services/gymService";
import type { ActiveWorkout, Routine } from "@/types/gym";

export function TrainScreen() {
  const { routineId } = useLocalSearchParams<{ routineId?: string }>();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [workout, setWorkout] = useState<ActiveWorkout | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmFinish, setConfirmFinish] = useState(false);
  const [clock, setClock] = useState(Date.now());

  useEffect(() => {
    let active = true;
    void Promise.all([gymService.getRoutines(), gymService.getActiveWorkout()])
      .then(([nextRoutines, activeWorkout]) => {
        if (!active) return null;
        setRoutines(nextRoutines);
        if (activeWorkout) return activeWorkout;
        const selectedRoutine = nextRoutines.find(
          (item) => item.id === routineId,
        );
        return selectedRoutine
          ? gymService.startWorkout(selectedRoutine)
          : null;
      })
      .then((activeWorkout) => {
        if (active && activeWorkout) setWorkout(activeWorkout);
      })
      .catch(() => {
        if (active)
          setError(
            "No pudimos recuperar tu entrenamiento. Revisa el almacenamiento y vuelve a intentarlo.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [routineId]);

  useEffect(() => {
    if (!workout || workout.status === "paused") return;
    const timerId = setInterval(() => setClock(Date.now()), 1000);
    return () => clearInterval(timerId);
  }, [workout]);

  const routine = useMemo(
    () => routines.find((item) => item.id === workout?.routineId) ?? null,
    [routines, workout?.routineId],
  );
  const allSets =
    routine?.exerciseDetails.reduce((sum, item) => sum + item.targetSets, 0) ??
    0;
  const completedSets = workout?.completedSetIds.length ?? 0;
  const currentExercise =
    routine?.exerciseDetails.find(
      (exercise) =>
        (workout?.completedSetIds.filter((setId) =>
          setId.startsWith(`${exercise.id}:`),
        ).length ?? 0) < exercise.targetSets,
    ) ?? null;
  const currentSetNumber = currentExercise
    ? (workout?.completedSetIds.filter((setId) =>
        setId.startsWith(`${currentExercise.id}:`),
      ).length ?? 0) + 1
    : 0;
  const elapsedSeconds = workout
    ? Math.max(
        0,
        Math.floor(
          ((workout.status === "paused" ? (workout.pausedAt ?? clock) : clock) -
            workout.startedAt) /
            1000 -
            workout.totalPausedSeconds,
        ),
      )
    : 0;
  const restRemaining = workout?.restUntil
    ? Math.max(0, Math.ceil((workout.restUntil - clock) / 1000))
    : 0;

  async function beginWorkout(selectedRoutine: Routine) {
    setSaving(true);
    setError(null);
    try {
      setWorkout(await gymService.startWorkout(selectedRoutine));
      setClock(Date.now());
    } catch {
      setError("No se pudo iniciar el entrenamiento. Inténtalo otra vez.");
    } finally {
      setSaving(false);
    }
  }

  async function completeSet() {
    if (
      !workout ||
      !currentExercise ||
      saving ||
      workout.status === "paused" ||
      restRemaining > 0
    )
      return;
    const setId = `${currentExercise.id}:${currentSetNumber}`;
    const completedSetIds = [...workout.completedSetIds, setId];
    const isFinished = completedSetIds.length >= allSets;
    const nextWorkout: ActiveWorkout = {
      ...workout,
      completedSetIds,
      restUntil: isFinished
        ? null
        : Date.now() + currentExercise.restSeconds * 1000,
    };
    setWorkout(nextWorkout);
    setClock(Date.now());
    setError(null);
    setSaving(true);
    try {
      await gymService.saveActiveWorkout(nextWorkout);
    } catch {
      setError(
        "La serie se completó, pero no se pudo guardar. Comprueba el espacio disponible.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function adjustWeight(change: number) {
    if (!workout || !currentExercise || saving) return;
    const currentWeight = workout.currentWeights[currentExercise.id] ?? 0;
    const nextWeight = Math.max(
      0,
      Math.round((currentWeight + change) * 10) / 10,
    );
    const nextWorkout = {
      ...workout,
      currentWeights: {
        ...workout.currentWeights,
        [currentExercise.id]: nextWeight,
      },
    };
    setWorkout(nextWorkout);
    setSaving(true);
    try {
      await gymService.saveActiveWorkout(nextWorkout);
    } catch {
      setError("No se pudo guardar el cambio de peso.");
    } finally {
      setSaving(false);
    }
  }

  async function togglePause() {
    if (!workout || saving) return;
    const now = Date.now();
    const pauseDuration = workout.pausedAt
      ? Math.floor((now - workout.pausedAt) / 1000)
      : 0;
    const restRemainingAtPause =
      workout.restUntil && workout.pausedAt
        ? workout.restUntil - workout.pausedAt
        : 0;
    const nextWorkout: ActiveWorkout =
      workout.status === "active"
        ? { ...workout, status: "paused", pausedAt: now }
        : {
            ...workout,
            status: "active",
            pausedAt: null,
            totalPausedSeconds: workout.totalPausedSeconds + pauseDuration,
            restUntil:
              restRemainingAtPause > 0 ? now + restRemainingAtPause : null,
          };
    setWorkout(nextWorkout);
    setClock(now);
    setError(null);
    setSaving(true);
    try {
      await gymService.saveActiveWorkout(nextWorkout);
    } catch {
      setError("No se pudo guardar el estado de pausa.");
    } finally {
      setSaving(false);
    }
  }

  async function finishWorkout() {
    if (!workout || !routine) return;
    setSaving(true);
    setError(null);
    try {
      await gymService.finishWorkout(workout, routine, elapsedSeconds);
      setConfirmFinish(false);
      setWorkout(null);
      router.replace("/(tabs)");
    } catch {
      setError(
        "No se pudo guardar el entrenamiento. Tu sesión sigue activa; vuelve a intentarlo.",
      );
      setConfirmFinish(false);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AppScreen>
        <ScreenHeading eyebrow="Modo entrenamiento" title="Entrenar" />
        <Surface>
          <SkeletonBlock style={{ height: 28 }} />
          <SkeletonBlock style={{ height: 100 }} />
          <SkeletonBlock style={{ height: 48 }} />
        </Surface>
      </AppScreen>
    );
  }

  if (!workout || !routine) {
    return (
      <AppScreen>
        <ScreenHeading
          eyebrow="A tu ritmo"
          title="Entrenar"
          detail="Elige una rutina para empezar. Tu progreso se guardará mientras entrenas."
        />
        {error ? (
          <Surface>
            <AppText color={palette.danger}>{error}</AppText>
          </Surface>
        ) : null}
        {routines.length === 0 ? (
          <Surface>
            <EmptyState
              title="Todavía no hay rutinas"
              detail="Crea o selecciona una rutina antes de iniciar una sesión."
            />
          </Surface>
        ) : (
          routines.map((item) => (
            <Surface key={item.id} style={styles.routineCard}>
              <View style={styles.routineTop}>
                <AppText variant="caption" color={palette.accent}>
                  {item.exercises} EJERCICIOS
                </AppText>
                <AppText variant="caption" color={palette.muted}>
                  {item.durationMinutes} MIN
                </AppText>
              </View>
              <AppText variant="title">{item.name}</AppText>
              <AppText color={palette.muted}>{item.focus}</AppText>
              <ActionButton
                label={saving ? "Iniciando..." : "Empezar esta rutina"}
                onPress={() => void beginWorkout(item)}
              />
            </Surface>
          ))
        )}
      </AppScreen>
    );
  }

  const progressPercent =
    allSets > 0 ? Math.round((completedSets / allSets) * 100) : 0;

  return (
    <AppScreen>
      <View style={styles.sessionHeader}>
        <View style={styles.sessionTitle}>
          <AppText variant="caption" color={palette.accent}>
            EN CURSO
          </AppText>
          <AppText variant="title">{routine.name}</AppText>
        </View>
        <View style={styles.timerBadge}>
          <AppText
            variant="caption"
            color={
              workout.status === "paused" ? palette.danger : palette.accent
            }
          >
            {workout.status === "paused" ? "PAUSADO" : "TIEMPO"}
          </AppText>
          <AppText variant="title">{formatTime(elapsedSeconds)}</AppText>
        </View>
      </View>

      <Surface style={styles.progressCard}>
        <View style={styles.progressLine}>
          <AppText variant="caption" color={palette.muted}>
            PROGRESO DE LA SESIÓN
          </AppText>
          <AppText variant="caption" color={palette.accent}>
            {completedSets} / {allSets} series
          </AppText>
        </View>
        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, { width: `${progressPercent}%` }]}
          />
        </View>
        <AppText variant="caption" color={palette.muted}>
          {progressPercent}% completado
        </AppText>
      </Surface>

      {error ? (
        <Surface style={styles.errorCard}>
          <AppText variant="caption" color={palette.danger}>
            {error}
          </AppText>
        </Surface>
      ) : null}

      {currentExercise ? (
        <>
          <View style={styles.exerciseHeading}>
            <AppText variant="caption" color={palette.muted}>
              EJERCICIO {routine.exerciseDetails.indexOf(currentExercise) + 1}{" "}
              DE {routine.exerciseDetails.length}
            </AppText>
            <AppText variant="title">{currentExercise.name}</AppText>
            <AppText color={palette.muted}>
              {currentExercise.targetSets} series · {currentExercise.targetReps}{" "}
              repeticiones
            </AppText>
          </View>

          <Surface style={styles.setTable}>
            <View style={styles.tableHeader}>
              <AppText variant="caption" color={palette.muted}>
                SERIE
              </AppText>
              <AppText variant="caption" color={palette.muted}>
                ANTERIOR
              </AppText>
              <AppText variant="caption" color={palette.muted}>
                ACTUAL
              </AppText>
            </View>
            {Array.from({ length: currentExercise.targetSets }, (_, index) => {
              const isComplete = workout.completedSetIds.includes(
                `${currentExercise.id}:${index + 1}`,
              );
              return (
                <View
                  key={`${currentExercise.id}-${index + 1}`}
                  style={[styles.setRow, isComplete && styles.setRowComplete]}
                >
                  <AppText
                    variant="caption"
                    color={isComplete ? palette.accent : palette.text}
                  >
                    {isComplete ? "✓" : `0${index + 1}`} ·{" "}
                    {currentExercise.targetReps} reps
                  </AppText>
                  <AppText variant="caption" color={palette.muted}>
                    {currentExercise.previousWeightKg} kg
                  </AppText>
                  <AppText variant="caption">
                    {workout.currentWeights[currentExercise.id] ??
                      currentExercise.currentWeightKg}{" "}
                    kg
                  </AppText>
                </View>
              );
            })}
            <View style={styles.weightControls}>
              <AppText variant="caption" color={palette.muted}>
                Peso de trabajo
              </AppText>
              <View style={styles.weightStepper}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Reducir peso 2.5 kilogramos"
                  disabled={saving}
                  onPress={() => void adjustWeight(-2.5)}
                  hitSlop={8}
                  style={[styles.stepButton, saving && styles.disabled]}
                >
                  <AppText variant="title">−</AppText>
                </Pressable>
                <AppText variant="title">
                  {workout.currentWeights[currentExercise.id] ??
                    currentExercise.currentWeightKg}{" "}
                  kg
                </AppText>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Aumentar peso 2.5 kilogramos"
                  disabled={saving}
                  onPress={() => void adjustWeight(2.5)}
                  hitSlop={8}
                  style={[styles.stepButton, saving && styles.disabled]}
                >
                  <AppText variant="title">+</AppText>
                </Pressable>
              </View>
            </View>
          </Surface>

          {restRemaining > 0 && workout.status === "active" ? (
            <Surface style={styles.restCard}>
              <AppText variant="caption" color={palette.accent}>
                DESCANSO
              </AppText>
              <AppText variant="display">{formatTime(restRemaining)}</AppText>
              <AppText color={palette.muted}>
                Siguiente serie · ajusta el descanso a tu ritmo
              </AppText>
              <Pressable
                accessibilityRole="button"
                disabled={saving}
                onPress={() => {
                  const nextWorkout = { ...workout, restUntil: null };
                  setWorkout(nextWorkout);
                  void gymService
                    .saveActiveWorkout(nextWorkout)
                    .catch(() => setError("No se pudo guardar el descanso."));
                }}
              >
                <AppText variant="caption" color={palette.accent}>
                  OMITIR DESCANSO
                </AppText>
              </Pressable>
            </Surface>
          ) : null}

          <ActionButton
            label={
              workout.status === "paused"
                ? "Entrenamiento en pausa"
                : restRemaining > 0
                  ? `Descanso · ${formatTime(restRemaining)}`
                  : `Completar serie ${currentSetNumber}`
            }
            onPress={() => void completeSet()}
            disabled={
              saving || workout.status === "paused" || restRemaining > 0
            }
          />
        </>
      ) : (
        <Surface>
          <EmptyState
            title="Rutina completada"
            detail="Has completado todas las series. Guarda tu sesión para añadirla al historial."
          />
        </Surface>
      )}

      <View style={styles.sessionActions}>
        <ActionButton
          label={workout.status === "active" ? "Pausar" : "Reanudar"}
          variant="secondary"
          disabled={saving}
          onPress={() => void togglePause()}
        />
        <ActionButton
          label="Finalizar"
          variant="quiet"
          disabled={saving}
          onPress={() => setConfirmFinish(true)}
        />
      </View>

      <Modal
        visible={confirmFinish}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmFinish(false)}
      >
        <View style={styles.modalBackdrop}>
          <Surface style={styles.confirmCard}>
            <AppText variant="title">¿Finalizar entrenamiento?</AppText>
            <AppText color={palette.muted}>
              {completedSets} de {allSets} series completadas. Se añadirá al
              historial y podrás revisarlo en Progreso.
            </AppText>
            <ActionButton
              label={saving ? "Guardando..." : "Finalizar y guardar"}
              disabled={saving}
              onPress={() => void finishWorkout()}
            />
            <ActionButton
              label="Seguir entrenando"
              variant="secondary"
              onPress={() => setConfirmFinish(false)}
            />
          </Surface>
        </View>
      </Modal>
    </AppScreen>
  );
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remaining = Math.max(0, seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${remaining}`;
}

const styles = StyleSheet.create({
  routineCard: { padding: spacing.lg },
  routineTop: { flexDirection: "row", justifyContent: "space-between" },
  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.sm,
  },
  sessionTitle: { flex: 1, gap: 4 },
  timerBadge: {
    minWidth: 88,
    alignItems: "center",
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: palette.surfaceRaised,
    borderRadius: 8,
  },
  progressCard: { padding: spacing.md },
  progressLine: { flexDirection: "row", justifyContent: "space-between" },
  progressTrack: {
    height: 7,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: palette.surfaceRaised,
  },
  progressFill: { height: "100%", backgroundColor: palette.accent },
  errorCard: { borderColor: palette.danger },
  exerciseHeading: { gap: spacing.xs },
  setTable: { padding: spacing.md },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  setRow: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  setRowComplete: { backgroundColor: "rgba(185, 244, 81, 0.06)" },
  weightControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: spacing.md,
  },
  weightStepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  stepButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.surfaceRaised,
  },
  disabled: { opacity: 0.5 },
  restCard: {
    alignItems: "center",
    padding: spacing.lg,
    backgroundColor: "#171D19",
  },
  sessionActions: { flexDirection: "row", gap: spacing.sm },
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    padding: spacing.lg,
    backgroundColor: "rgba(0,0,0,0.72)",
  },
  confirmCard: { padding: spacing.lg },
});
