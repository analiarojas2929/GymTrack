import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

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

export function HomeScreen() {
  const { summary, routines, profile, loading, error, reload } = useGymData();
  const completed = summary?.sessionsThisWeek ?? 0;
  const goal = summary?.weeklyGoal ?? profile?.weeklyGoal ?? 4;
  const today = new Date();
  const dateLabel = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(today);
  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    const mondayOffset = (today.getDay() + 6) % 7;
    date.setDate(today.getDate() - mondayOffset + index);
    return {
      label: dayLabels[index],
      dayNumber: date.getDate(),
      dateKey: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
      complete: false,
      isToday: date.toDateString() === today.toDateString(),
    };
  });
  weekDays.forEach((day) => {
    day.complete = summary?.goalDays.includes(day.dateKey) ?? false;
  });
  const todayRoutine = routines[0];
  const latestWorkout = summary?.history[0];

  return (
    <AppScreen>
      <View style={styles.greeting}>
        <View style={styles.greetingCopy}>
          <AppText variant="caption" color={palette.muted}>
            {dateLabel.toLocaleUpperCase("es-ES")}
          </AppText>
          <AppText variant="title">
            Hola, {profile?.firstName ?? "atleta"}
          </AppText>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Abrir perfil"
          onPress={() => router.push("/(tabs)/profile")}
          style={styles.avatar}
        >
          <AppText variant="caption" color={palette.accent}>
            {profile?.firstName.slice(0, 1) ?? "G"}
          </AppText>
        </Pressable>
      </View>

      {loading ? (
        <Surface style={styles.hero}>
          <SkeletonBlock style={{ width: "40%" }} />
          <SkeletonBlock style={{ width: "72%", height: 38 }} />
          <SkeletonBlock style={{ width: "88%" }} />
          <SkeletonBlock style={{ height: 48 }} />
        </Surface>
      ) : error ? (
        <Surface>
          <EmptyState
            title="No cargaron tus datos"
            detail={error}
            action={{ label: "Reintentar", onPress: reload }}
          />
        </Surface>
      ) : (
        <Surface style={styles.hero}>
          <View style={styles.heroTop}>
            <AppText variant="caption" color={palette.accent}>
              TU META SEMANAL
            </AppText>
            <AppText variant="caption" color={palette.muted}>
              {completed} / {goal} SESIONES
            </AppText>
          </View>
          <View style={styles.goalRow}>
            <View style={styles.goalCopy}>
              <AppText variant="display">
                {Math.min(
                  Math.round((completed / Math.max(goal, 1)) * 100),
                  100,
                )}
                %
              </AppText>
              <AppText color={palette.muted}>
                {goal - completed > 0
                  ? `Te falta${goal - completed === 1 ? "" : "n"} ${goal - completed} para cumplir tu objetivo`
                  : "Objetivo semanal cumplido"}
              </AppText>
            </View>
            <View
              style={styles.goalRing}
              accessibilityLabel={`${completed} de ${goal} sesiones completadas`}
            >
              <AppText variant="title" color={palette.accent}>
                {completed}
              </AppText>
              <AppText variant="caption" color={palette.muted}>
                DE {goal}
              </AppText>
            </View>
          </View>
          <View style={styles.weekStrip}>
            {weekDays.map((day) => (
              <View
                key={`${day.label}-${day.dayNumber}`}
                style={styles.weekDay}
              >
                <AppText variant="caption" color={palette.muted}>
                  {day.label}
                </AppText>
                <View
                  style={[
                    styles.dayMark,
                    day.complete && styles.dayComplete,
                    day.isToday && styles.dayToday,
                  ]}
                >
                  <AppText
                    variant="caption"
                    color={
                      day.complete || day.isToday
                        ? palette.background
                        : palette.muted
                    }
                  >
                    {day.complete ? "✓" : day.dayNumber}
                  </AppText>
                </View>
              </View>
            ))}
          </View>
        </Surface>
      )}

      <View style={styles.sectionHeader}>
        <ScreenHeading
          eyebrow="Tu plan"
          title="Entrenamiento de hoy"
          detail="Listo cuando tú lo estés."
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ver todas las rutinas"
          onPress={() => router.push("/(tabs)/routines")}
        >
          <AppText variant="caption" color={palette.accent}>
            VER TODO
          </AppText>
        </Pressable>
      </View>
      {loading ? (
        <Surface style={styles.todayCard}>
          <SkeletonBlock style={{ width: "52%" }} />
          <SkeletonBlock style={{ width: "78%" }} />
          <SkeletonBlock style={{ height: 48 }} />
        </Surface>
      ) : todayRoutine ? (
        <Surface style={styles.todayCard}>
          <View style={styles.routineLabel}>
            <AppText variant="caption" color={palette.accent}>
              RECOMENDADA PARA HOY
            </AppText>
            <AppText variant="caption" color={palette.muted}>
              {todayRoutine.durationMinutes} MIN
            </AppText>
          </View>
          <AppText variant="title">{todayRoutine.name}</AppText>
          <AppText color={palette.muted}>{todayRoutine.focus}</AppText>
          <View style={styles.cardFooter}>
            <AppText variant="caption" color={palette.muted}>
              {todayRoutine.exercises} ejercicios ·{" "}
              {todayRoutine.sessionsPerWeek} días/semana
            </AppText>
            <ActionButton
              label="Empezar entrenamiento"
              onPress={() => router.push("/(tabs)/train")}
            />
          </View>
        </Surface>
      ) : (
        <Surface>
          <EmptyState
            title="Sin rutina para hoy"
            detail="Explora tus rutinas y elige una para empezar."
            action={{
              label: "Ver rutinas",
              onPress: () => router.push("/(tabs)/routines"),
            }}
          />
        </Surface>
      )}

      <ScreenHeading eyebrow="En un vistazo" title="Esta semana" />
      <View style={styles.metrics}>
        <Metric label="SESIONES" value={`${completed}`} suffix={` / ${goal}`} />
        <Metric
          label="VOLUMEN"
          value={`${((summary?.volumeKg ?? 0) / 1000).toFixed(1)}`}
          suffix=" t"
        />
        <Metric
          label="TIEMPO"
          value={`${summary?.durationMinutes ?? 0}`}
          suffix=" min"
        />
      </View>

      <AppText variant="title">Accesos rápidos</AppText>
      <View style={styles.shortcuts}>
        <QuickAction
          label="Ejercicios"
          detail="Explorar biblioteca"
          marker="E"
          onPress={() => router.push("/exercises")}
        />
        <QuickAction
          label="Progreso"
          detail="Ver tus marcas"
          marker="↗"
          onPress={() => router.push("/(tabs)/progress")}
        />
      </View>

      {latestWorkout ? (
        <Surface style={styles.lastWorkout}>
          <View style={styles.lastWorkoutMark}>
            <AppText variant="title" color={palette.accent}>
              ↻
            </AppText>
          </View>
          <View style={styles.lastWorkoutCopy}>
            <AppText variant="caption" color={palette.muted}>
              ÚLTIMO ENTRENAMIENTO
            </AppText>
            <AppText>{latestWorkout.routineName}</AppText>
          </View>
          <AppText variant="caption" color={palette.muted}>
            {latestWorkout.durationMinutes} min
          </AppText>
        </Surface>
      ) : null}
    </AppScreen>
  );
}

function QuickAction({
  label,
  detail,
  marker,
  onPress,
}: {
  label: string;
  detail: string;
  marker: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={styles.quickAction}
    >
      <View style={styles.quickMarker}>
        <AppText variant="title" color={palette.accent}>
          {marker}
        </AppText>
      </View>
      <View style={styles.quickCopy}>
        <AppText variant="caption">{label}</AppText>
        <AppText variant="caption" color={palette.muted}>
          {detail}
        </AppText>
      </View>
      <AppText variant="title" color={palette.muted}>
        ›
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  greeting: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  greetingCopy: { gap: 4 },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.accentDim,
  },
  hero: { padding: spacing.lg, backgroundColor: "#171D19" },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  goalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  goalCopy: { flex: 1, gap: spacing.xs },
  goalRing: {
    width: 76,
    aspectRatio: 1,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: palette.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  weekStrip: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: palette.border,
  },
  weekDay: { alignItems: "center", gap: spacing.xs },
  dayMark: {
    width: 30,
    aspectRatio: 1,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.surfaceRaised,
  },
  dayComplete: { backgroundColor: palette.accent },
  dayToday: { borderWidth: 1, borderColor: palette.accent },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  todayCard: { padding: spacing.lg },
  routineLabel: { flexDirection: "row", justifyContent: "space-between" },
  cardFooter: {
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: palette.border,
    paddingTop: spacing.md,
    marginTop: spacing.xs,
  },
  metrics: { flexDirection: "row", gap: spacing.xs },
  shortcuts: { gap: spacing.sm },
  quickAction: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
  },
  quickMarker: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.accentDim,
  },
  quickCopy: { flex: 1, gap: 4 },
  lastWorkout: { flexDirection: "row", alignItems: "center" },
  lastWorkoutMark: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.accentDim,
  },
  lastWorkoutCopy: { flex: 1, gap: 3, paddingHorizontal: spacing.md },
});
