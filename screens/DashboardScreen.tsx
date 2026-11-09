import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import {
    ActionButton,
    AppScreen,
    AppText,
    Metric,
    ScreenHeading,
    Surface,
} from "@/components/ui";
import { palette, spacing } from "@/constants/theme";
import { useGymData } from "@/hooks/useGymData";

export function DashboardScreen() {
  const { summary, routines } = useGymData();
  const completed = summary?.sessionsThisWeek ?? 0;
  const goal = summary?.weeklyGoal ?? 4;

  return (
    <AppScreen>
      <View style={styles.greeting}>
        <View>
          <AppText variant="caption" color={palette.muted}>
            LUNES, 9 DE NOVIEMBRE
          </AppText>
          <AppText variant="title">Hola, Alex</AppText>
        </View>
        <View style={styles.avatar}>
          <AppText variant="caption" color={palette.accent}>
            AR
          </AppText>
        </View>
      </View>
      <Surface style={styles.hero}>
        <View style={styles.heroTop}>
          <AppText variant="caption" color={palette.accent}>
            TU CONSTANCIA CUENTA
          </AppText>
          <AppText variant="caption" color={palette.muted}>
            SEMANA 12
          </AppText>
        </View>
        <AppText variant="display">Un poco{"\n"}más fuerte.</AppText>
        <AppText color={palette.muted}>
          Has completado {completed} de {goal} entrenamientos esta semana.
        </AppText>
        <View style={styles.track}>
          <View
            style={[
              styles.fill,
              { width: `${Math.min((completed / goal) * 100, 100)}%` },
            ]}
          />
        </View>
        <ActionButton
          label="Registrar entrenamiento"
          onPress={() => router.push("/workout-log")}
        />
      </Surface>
      <View style={styles.metrics}>
        <Metric
          label="ENTRENAMIENTOS"
          value={`${completed}`}
          suffix={` / ${goal}`}
        />
        <Metric
          label="TIEMPO ACTIVO"
          value={`${summary?.durationMinutes ?? 0}`}
          suffix=" min"
        />
      </View>
      <ScreenHeading eyebrow="Sigue con tu plan" title="Tu próxima sesión" />
      <Surface style={styles.routine}>
        <View style={styles.routineIcon}>
          <AppText variant="title" color={palette.accent}>
            A
          </AppText>
        </View>
        <View style={styles.routineInfo}>
          <AppText variant="title">
            {routines[0]?.name ?? "Tren superior"}
          </AppText>
          <AppText variant="caption" color={palette.muted}>
            HOY · 55 MIN · 6 EJERCICIOS
          </AppText>
        </View>
        <Pressable
          onPress={() => router.push("/(tabs)/routines")}
          style={styles.arrow}
        >
          <AppText variant="title" color={palette.accent}>
            ›
          </AppText>
        </Pressable>
      </Surface>
      <View style={styles.sectionLine}>
        <AppText variant="title">Actividad reciente</AppText>
        <AppText variant="caption" color={palette.accent}>
          VER TODO
        </AppText>
      </View>
      <View style={styles.activity}>
        <View style={styles.activityDot} />
        <View style={styles.activityInfo}>
          <AppText>Tren superior</AppText>
          <AppText variant="caption" color={palette.muted}>
            Ayer · 48 min
          </AppText>
        </View>
        <AppText variant="caption" color={palette.muted}>
          4.2 t
        </AppText>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  greeting: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.accentDim,
  },
  hero: {
    padding: spacing.lg,
    minHeight: 270,
    justifyContent: "space-between",
    backgroundColor: "#171D19",
  },
  heroTop: { flexDirection: "row", justifyContent: "space-between" },
  track: {
    height: 6,
    backgroundColor: palette.surfaceRaised,
    borderRadius: 8,
    overflow: "hidden",
  },
  fill: { height: "100%", backgroundColor: palette.accent },
  metrics: { flexDirection: "row", gap: spacing.sm },
  routine: { flexDirection: "row", alignItems: "center" },
  routineIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: palette.accentDim,
    alignItems: "center",
    justifyContent: "center",
  },
  routineInfo: { flex: 1, gap: 4, paddingLeft: spacing.md },
  arrow: { paddingHorizontal: spacing.sm },
  sectionLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.sm,
  },
  activity: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: palette.accent,
  },
  activityInfo: { flex: 1, gap: 3 },
});
