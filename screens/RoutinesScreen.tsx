import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

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

  return (
    <AppScreen>
      <ScreenHeading
        eyebrow="Tu entrenamiento"
        title="Rutinas"
        detail="Planes listos para adaptar a tu semana."
      />
      <ActionButton
        label="＋  Crear rutina personalizada"
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
          <ActionButton
            label="Empezar sesión"
            onPress={() => router.push("/workout-log")}
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
});
