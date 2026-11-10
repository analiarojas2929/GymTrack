import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import {
    ActionButton,
    AppScreen,
    AppText,
    ScreenHeading,
    Surface,
} from "@/components/ui";
import { palette, spacing } from "@/constants/theme";
import { useGymData } from "@/hooks/useGymData";

export function RoutinesScreen() {
  const { routines } = useGymData();
  const [expandedRoutineId, setExpandedRoutineId] = useState<string | null>(null);

  return (
    <AppScreen>
      <ScreenHeading
        eyebrow="Tu entrenamiento"
        title="Rutinas"
        detail="Planes listos para adaptar a tu semana."
      />
      <ActionButton
        label="Añadir resumen manual"
        variant="secondary"
        onPress={() => router.push("/workout-log")}
      />
      <AppText variant="caption" color={palette.muted}>
        TUS PLANES
      </AppText>
      {routines.map((routine, index) => (
        <Surface key={routine.id} style={styles.routine}>
          <View style={styles.top}>
            <AppText variant="caption" color={palette.accent}>
              PLAN 0{index + 1}
            </AppText>
            <AppText variant="caption" color={palette.muted}>
              {routine.sessionsPerWeek} DÍAS / SEMANA
            </AppText>
          </View>
          <AppText variant="title">{routine.name}</AppText>
          <AppText color={palette.muted}>{routine.focus}</AppText>
          <View style={styles.meta}>
            <AppText variant="caption" color={palette.muted}>
              {routine.durationMinutes} min
            </AppText>
            <AppText variant="caption" color={palette.muted}>
              {routine.exercises} ejercicios
            </AppText>
            <AppText variant="caption" color={palette.muted}>
              Intermedio
            </AppText>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ expanded: expandedRoutineId === routine.id }}
            onPress={() => setExpandedRoutineId((current) => current === routine.id ? null : routine.id)}
            style={styles.detailToggle}
          >
            <AppText variant="caption" color={palette.accent}>
              {expandedRoutineId === routine.id ? "OCULTAR EJERCICIOS" : "VER EJERCICIOS Y SERIES"}
            </AppText>
            <AppText variant="caption" color={palette.muted}>
              {expandedRoutineId === routine.id ? "−" : "+"}
            </AppText>
          </Pressable>
          {expandedRoutineId === routine.id ? (
            <View style={styles.exerciseList}>
              <View style={styles.exerciseHeader}>
                <AppText variant="caption" color={palette.muted}>EJERCICIO</AppText>
                <AppText variant="caption" color={palette.muted}>SERIES × REPS</AppText>
              </View>
              {routine.exerciseDetails.map((exercise) => (
                <View key={exercise.id} style={styles.exerciseRow}>
                  <View style={styles.exerciseCopy}>
                    <AppText variant="caption">{exercise.name}</AppText>
                    <AppText variant="caption" color={palette.muted}>
                      {exercise.previousWeightKg} → {exercise.currentWeightKg} kg · descanso {exercise.restSeconds}s
                    </AppText>
                  </View>
                  <AppText variant="caption" color={palette.accent}>
                    {exercise.targetSets} × {exercise.targetReps}
                  </AppText>
                </View>
              ))}
            </View>
          ) : null}
          <ActionButton
            label="Empezar rutina"
            onPress={() => router.push({
              pathname: "/(tabs)/train",
              params: { routineId: routine.id },
            })}
          />
        </Surface>
      ))}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  routine: { padding: spacing.lg },
  top: { flexDirection: "row", justifyContent: "space-between" },
  meta: {
    flexDirection: "row",
    gap: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: palette.border,
    paddingTop: spacing.md,
    marginTop: spacing.xs,
  },
  detailToggle: { flexDirection: "row", justifyContent: "space-between", paddingVertical: spacing.sm },
  exerciseList: { gap: spacing.xs, paddingVertical: spacing.xs },
  exerciseHeader: { flexDirection: "row", justifyContent: "space-between", paddingBottom: spacing.xs },
  exerciseRow: { minHeight: 50, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm, borderTopWidth: 1, borderTopColor: palette.border },
  exerciseCopy: { flex: 1, gap: 3 },
});
