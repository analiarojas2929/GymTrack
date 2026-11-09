import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, TextInput, View } from 'react-native';

import { ActionButton, AppScreen, AppText, ScreenHeading, Surface } from '@/components/ui';
import { palette, spacing } from '@/constants/theme';

export default function WorkoutLogScreen() {
  const [duration, setDuration] = useState('45');
  const [volume, setVolume] = useState('3200');

  function saveWorkout() {
    Alert.alert('Registro simulado', 'La persistencia de entrenamientos se conectará en una siguiente etapa.', [{ text: 'Listo', onPress: () => router.back() }]);
  }

  return (
    <AppScreen>
      <ScreenHeading eyebrow="Nueva sesión" title="Registrar entrenamiento" detail="Añade un resumen para mantener tu progreso al día." />
      <Surface style={styles.sessionType}><AppText variant="caption" color={palette.muted}>RUTINA SELECCIONADA</AppText><AppText variant="title">Tren superior</AppText><AppText color={palette.muted}>6 ejercicios · Pecho, espalda y hombros</AppText></Surface>
      <Field label="Duración (minutos)" value={duration} onChangeText={setDuration} keyboardType="number-pad" />
      <Field label="Volumen total (kg)" value={volume} onChangeText={setVolume} keyboardType="number-pad" />
      <View style={styles.note}><AppText variant="caption" color={palette.muted}>Los registros se guardan en memoria durante esta etapa. La persistencia se conectará mediante el servicio de entrenamientos.</AppText></View>
      <ActionButton label="Guardar entrenamiento" onPress={saveWorkout} />
    </AppScreen>
  );
}

function Field({ label, ...inputProps }: { label: string; value: string; onChangeText: (value: string) => void; keyboardType: 'number-pad' }) {
  return <View style={styles.field}><AppText variant="caption">{label}</AppText><TextInput {...inputProps} style={styles.input} keyboardType={inputProps.keyboardType} placeholderTextColor={palette.muted} /></View>;
}

const styles = StyleSheet.create({
  sessionType: { padding: spacing.lg },
  field: { gap: spacing.xs },
  input: { height: 52, borderRadius: 8, paddingHorizontal: spacing.md, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.border, color: palette.text, fontSize: 16 },
  note: { borderLeftWidth: 2, borderLeftColor: palette.accent, paddingVertical: spacing.xs, paddingLeft: spacing.md },
});