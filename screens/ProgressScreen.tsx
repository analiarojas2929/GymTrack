import { StyleSheet, View } from "react-native";

import {
    AppScreen,
    AppText,
    Metric,
    ScreenHeading,
    Surface,
} from "@/components/ui";
import { palette, spacing } from "@/constants/theme";
import { useGymData } from "@/hooks/useGymData";

const week = [0.42, 0.68, 0.5, 0.88, 0.62, 1, 0.3];
const days = ["L", "M", "X", "J", "V", "S", "D"];

export function ProgressScreen() {
  const { summary } = useGymData();

  return (
    <AppScreen>
      <ScreenHeading
        eyebrow="Cada repetición suma"
        title="Tu progreso"
        detail="Un vistazo a las últimas semanas."
      />
      <View style={styles.metrics}>
        <Metric label="SESIONES" value="12" suffix=" / mes" />
        <Metric label="VOLUMEN TOTAL" value="8.4" suffix=" t" />
      </View>
      <Surface style={styles.chart}>
        <View style={styles.chartTitle}>
          <View>
            <AppText variant="caption" color={palette.muted}>
              VOLUMEN ENTRENADO
            </AppText>
            <AppText variant="title">Esta semana</AppText>
          </View>
          <AppText variant="caption" color={palette.accent}>
            +12.8%
          </AppText>
        </View>
        <View style={styles.bars}>
          {week.map((height, index) => (
            <View key={days[index]} style={styles.barGroup}>
              <View
                style={[
                  styles.bar,
                  index === 5 && styles.barActive,
                  { height: `${height * 100}%` },
                ]}
              />
              <AppText variant="caption" color={palette.muted}>
                {days[index]}
              </AppText>
            </View>
          ))}
        </View>
      </Surface>
      <ScreenHeading eyebrow="Resumen semanal" title="Buen trabajo" />
      <Surface style={styles.summary}>
        <View>
          <AppText variant="caption" color={palette.muted}>
            ENTRENAMIENTOS COMPLETADOS
          </AppText>
          <AppText variant="title">
            {summary?.sessionsThisWeek ?? 0} de {summary?.weeklyGoal ?? 4}
          </AppText>
        </View>
        <View style={styles.goalTrack}>
          <View
            style={[
              styles.goalFill,
              {
                width: `${((summary?.sessionsThisWeek ?? 0) / (summary?.weeklyGoal ?? 4)) * 100}%`,
              },
            ]}
          />
        </View>
        <AppText variant="caption" color={palette.muted}>
          Un entrenamiento más para alcanzar tu objetivo.
        </AppText>
      </Surface>
      <Surface style={styles.personalBest}>
        <View style={styles.bestMark}>
          <AppText variant="title" color={palette.accent}>
            ↗
          </AppText>
        </View>
        <View style={styles.bestText}>
          <AppText variant="caption" color={palette.muted}>
            MARCA PERSONAL
          </AppText>
          <AppText variant="title">Sentadilla · 95 kg</AppText>
        </View>
        <AppText variant="caption" color={palette.accent}>
          +5 kg
        </AppText>
      </Surface>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  metrics: { flexDirection: "row", gap: spacing.sm },
  chart: { minHeight: 250, padding: spacing.lg },
  chartTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bars: {
    height: 145,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: spacing.sm,
    paddingTop: spacing.md,
  },
  barGroup: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: spacing.xs,
  },
  bar: {
    width: "70%",
    minHeight: 12,
    borderRadius: 4,
    backgroundColor: "#3A4930",
  },
  barActive: { backgroundColor: palette.accent },
  summary: { padding: spacing.lg },
  goalTrack: {
    height: 7,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: palette.surfaceRaised,
  },
  goalFill: { height: "100%", backgroundColor: palette.accent },
  personalBest: { flexDirection: "row", alignItems: "center" },
  bestMark: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: palette.accentDim,
  },
  bestText: { flex: 1, gap: 3, paddingLeft: spacing.md },
});
