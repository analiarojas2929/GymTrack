import { useState } from 'react';
import { StyleSheet, TextInput, Pressable, View } from 'react-native';

import { AppScreen, AppText, ScreenHeading, Surface } from '@/components/ui';
import { palette, spacing } from '@/constants/theme';
import { useGymData } from '@/hooks/useGymData';

const muscleGroups = ['Todos', 'Piernas', 'Pecho', 'Espalda', 'Hombros'];

export function ExercisesScreen() {
  const { exercises } = useGymData();
  const [activeGroup, setActiveGroup] = useState('Todos');
  const [query, setQuery] = useState('');
  const filtered = exercises.filter((exercise) => {
    const matchesGroup = activeGroup === 'Todos' || exercise.muscle === activeGroup;
    const matchesQuery = exercise.name.toLowerCase().includes(query.toLowerCase());
    return matchesGroup && matchesQuery;
  });

  return (
    <AppScreen>
      <ScreenHeading eyebrow="Biblioteca" title="Ejercicios" detail={`${exercises.length} movimientos para tu próximo entrenamiento`} />
      <TextInput value={query} onChangeText={setQuery} placeholder="Buscar ejercicio" placeholderTextColor={palette.muted} style={styles.search} />
      <View style={styles.filters}>{muscleGroups.map((group) => <Pressable key={group} onPress={() => setActiveGroup(group)} style={[styles.filter, activeGroup === group && styles.filterActive]}><AppText variant="caption" color={activeGroup === group ? palette.background : palette.muted}>{group}</AppText></Pressable>)}</View>
      <AppText variant="caption" color={palette.muted}>MOVIMIENTOS RECOMENDADOS</AppText>
      {filtered.map((exercise, index) => (
        <Surface key={exercise.id} style={styles.exercise}>
          <View style={[styles.exerciseNumber, index % 2 === 1 && styles.exerciseNumberAlt]}><AppText variant="caption" color={palette.accent}>0{index + 1}</AppText></View>
          <View style={styles.exerciseInfo}><AppText variant="title" style={styles.exerciseName}>{exercise.name}</AppText><AppText variant="caption" color={palette.muted}>{exercise.muscle} · {exercise.equipment}</AppText></View>
          <AppText variant="caption" color={palette.accent}>{exercise.level === 'Principiante' ? 'BASE' : exercise.level === 'Avanzado' ? 'PRO' : 'MEDIO'}</AppText>
        </Surface>
      ))}
      {filtered.length === 0 ? <AppText color={palette.muted}>No encontramos ejercicios con esos filtros.</AppText> : null}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  search: { height: 50, borderRadius: 8, paddingHorizontal: spacing.md, color: palette.text, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.border, fontSize: 15 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  filter: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, backgroundColor: palette.surface, borderRadius: 20 },
  filterActive: { backgroundColor: palette.accent },
  exercise: { flexDirection: 'row', alignItems: 'center', minHeight: 76 },
  exerciseNumber: { width: 42, height: 42, borderRadius: 6, backgroundColor: palette.accentDim, alignItems: 'center', justifyContent: 'center' },
  exerciseNumberAlt: { backgroundColor: palette.surfaceRaised },
  exerciseInfo: { flex: 1, paddingHorizontal: spacing.md, gap: 4 },
  exerciseName: { fontSize: 16 },
});