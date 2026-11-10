import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

import {
  ActionButton,
  AppScreen,
  AppText,
  EmptyState,
  Metric,
  ScreenHeading,
  SkeletonBlock,
  Surface,
} from "@/components/ui";
import { palette, spacing } from "@/constants/theme";
import { useGymData } from "@/hooks/useGymData";

const dayLabels = ["L", "M", "X", "J", "V", "S", "D"];

export function ProgressOverviewScreen() {
  const { summary, profile, loading, error, reload } = useGymData();
  const history = summary?.history ?? [];
  const volumeByDay = summary?.dailyVolumesKg ?? Array.from({ length: 7 }, () => 0);
  const weeklyGoal = summary?.weeklyGoal ?? profile?.weeklyGoal ?? 4;
  const sessions = summary?.sessionsThisWeek ?? 0;
  const volumeThisWeek = volumeByDay.reduce((sum, volume) => sum + volume, 0);
  const maxDailyVolume = Math.max(...volumeByDay, 1);

  return (
    <AppScreen>
      <ScreenHeading eyebrow="Cada repetición suma" title="Tu progreso" detail="Resultados construidos sesión a sesión." />
      {loading ? (
        <View style={styles.metrics}>
          <SkeletonBlock style={styles.metricSkeleton} />
          <SkeletonBlock style={styles.metricSkeleton} />
        </View>
      ) : error ? (
        <Surface><EmptyState title="No cargaron tus datos" detail={error} action={{ label: "Reintentar", onPress: reload }} /></Surface>
      ) : (
        <View style={styles.metrics}>
          <Metric label="SESIONES ESTA SEMANA" value={`${sessions}`} suffix={` / ${weeklyGoal}`} />
          <Metric label="VOLUMEN SEMANAL" value={`${(volumeThisWeek / 1000).toFixed(1)}`} suffix=" t" />
        </View>
      )}

      <Surface style={styles.chart}>
        <View style={styles.chartTitle}>
          <View style={styles.chartHeading}>
            <AppText variant="caption" color={palette.muted}>VOLUMEN ENTRENADO</AppText>
            <AppText variant="title">Esta semana</AppText>
          </View>
          <AppText variant="caption" color={palette.accent}>{Math.round(volumeThisWeek).toLocaleString("es-ES")} kg</AppText>
        </View>
        {loading ? <SkeletonBlock style={{ height: 130 }} /> : volumeThisWeek === 0 ? (
          <EmptyState title="Aún no hay sesiones" detail="Tu gráfica aparecerá aquí después de tu primer entrenamiento." />
        ) : (
          <View style={styles.bars}>
            {volumeByDay.map((volume, index) => (
              <View key={dayLabels[index]} style={styles.barGroup}>
                <View style={[styles.bar, volume > 0 && styles.barActive, { height: `${Math.max(volume > 0 ? 14 : 4, (volume / maxDailyVolume) * 100)}%` }]} />
                <AppText variant="caption" color={palette.muted}>{dayLabels[index]}</AppText>
              </View>
            ))}
          </View>
        )}
      </Surface>

      <ScreenHeading eyebrow="Objetivo semanal" title="Tu constancia" />
      <Surface style={styles.goalCard}>
        <View style={styles.goalRow}>
          <View style={styles.goalText}>
            <AppText variant="title">{sessions} de {weeklyGoal} sesiones</AppText>
            <AppText variant="caption" color={palette.muted}>{Math.max(weeklyGoal - sessions, 0) === 0 ? "Objetivo cumplido. Excelente trabajo." : `Te ${weeklyGoal - sessions === 1 ? "falta" : "faltan"} ${weeklyGoal - sessions} para la meta.`}</AppText>
          </View>
          <AppText variant="title" color={palette.accent}>{Math.min(Math.round((sessions / Math.max(weeklyGoal, 1)) * 100), 100)}%</AppText>
        </View>
        <View style={styles.goalTrack}><View style={[styles.goalFill, { width: `${Math.min((sessions / Math.max(weeklyGoal, 1)) * 100, 100)}%` }]} /></View>
      </Surface>

      <View style={styles.sectionHeading}><ScreenHeading eyebrow="Tus mejores cargas" title="Récords personales" /></View>
      {summary?.personalRecords.map((record) => (
        <Surface key={record.exerciseId} style={styles.record}>
          <View style={styles.recordIcon}><AppText variant="title" color={palette.accent}>↗</AppText></View>
          <View style={styles.recordCopy}>
            <AppText variant="caption" color={palette.muted}>{new Date(record.achievedAt).toLocaleDateString("es-ES", { day: "numeric", month: "short" }).toUpperCase()}</AppText>
            <AppText variant="title">{record.exerciseName}</AppText>
          </View>
          <AppText variant="title" color={palette.accent}>{record.weightKg} kg</AppText>
        </Surface>
      ))}

      <View style={styles.sectionHeading}><ScreenHeading eyebrow="Actividad" title="Historial" /></View>
      {loading ? (
        <Surface><SkeletonBlock style={{ height: 52 }} /><SkeletonBlock style={{ height: 52 }} /></Surface>
      ) : history.length === 0 ? (
        <Surface>
          <EmptyState title="Tu historial está vacío" detail="Registra tu primer entrenamiento y volveremos aquí con tus resultados." action={{ label: "Ir a entrenar", onPress: () => router.push("/(tabs)/train") }} />
        </Surface>
      ) : history.slice(0, 6).map((entry) => (
        <Surface key={entry.id} style={styles.historyRow}>
          <View style={styles.historyMark}><AppText variant="caption" color={palette.accent}>✓</AppText></View>
          <View style={styles.historyCopy}>
            <AppText variant="caption" color={palette.muted}>{new Date(entry.startedAt).toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" }).toUpperCase()}</AppText>
            <AppText variant="title">{entry.routineName}</AppText>
            <AppText variant="caption" color={palette.muted}>{entry.completedSets}/{entry.totalSets} series · {entry.durationMinutes} min</AppText>
          </View>
          <AppText variant="caption" color={palette.muted}>{(entry.volumeKg / 1000).toFixed(1)} t</AppText>
        </Surface>
      ))}
      {history.length === 0 && !loading ? <ActionButton label="Empezar entrenamiento" onPress={() => router.push("/(tabs)/train")} /> : null}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  metrics: { flexDirection: "row", gap: spacing.sm },
  metricSkeleton: { flex: 1, height: 92, borderRadius: 8 },
  chart: { minHeight: 230, padding: spacing.lg },
  chartTitle: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  chartHeading: { gap: 4 },
  bars: { height: 132, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: spacing.sm, paddingTop: spacing.md },
  barGroup: { flex: 1, height: "100%", alignItems: "center", justifyContent: "flex-end", gap: spacing.xs },
  bar: { width: "70%", minHeight: 4, borderRadius: 4, backgroundColor: palette.surfaceRaised },
  barActive: { backgroundColor: palette.accent },
  goalCard: { padding: spacing.lg },
  goalRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm },
  goalText: { flex: 1, gap: spacing.xs },
  goalTrack: { height: 7, borderRadius: 8, overflow: "hidden", backgroundColor: palette.surfaceRaised },
  goalFill: { height: "100%", backgroundColor: palette.accent },
  sectionHeading: { marginTop: spacing.xs },
  record: { flexDirection: "row", alignItems: "center" },
  recordIcon: { width: 42, height: 42, alignItems: "center", justifyContent: "center", borderRadius: 8, backgroundColor: palette.accentDim },
  recordCopy: { flex: 1, gap: 3, paddingHorizontal: spacing.md },
  historyRow: { flexDirection: "row", alignItems: "center" },
  historyMark: { width: 36, height: 36, alignItems: "center", justifyContent: "center", borderRadius: 18, backgroundColor: palette.accentDim },
  historyCopy: { flex: 1, gap: 3, paddingHorizontal: spacing.md },
});