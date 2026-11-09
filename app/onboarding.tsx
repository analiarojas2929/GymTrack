import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ActionButton, AppScreen, AppText, Surface } from '@/components/ui';
import { palette, spacing } from '@/constants/theme';

export default function OnboardingScreen() {
  return (
    <AppScreen>
      <View style={styles.topline}><AppText variant="caption" color={palette.accent}>GYMTRACK / 01</AppText><AppText variant="caption" color={palette.muted}>ENTRENA CON INTENCIÓN</AppText></View>
      <View style={styles.hero}>
        <View style={styles.mark}><View style={styles.markBar} /><View style={[styles.markBar, styles.markBarShort]} /><View style={styles.markBar} /></View>
        <AppText variant="display">Tu fuerza,{ '\n' }tu ritmo.</AppText>
        <AppText color={palette.muted}>Un entrenamiento a la vez. Construye hábitos que se notan.</AppText>
      </View>
      <Surface style={styles.preview}>
        <View style={styles.previewHeader}><AppText variant="caption" color={palette.muted}>OBJETIVO SEMANAL</AppText><AppText variant="caption" color={palette.accent}>03 / 04</AppText></View>
        <View style={styles.track}><View style={styles.fill} /></View>
        <AppText variant="caption">Vas por buen camino</AppText>
      </Surface>
      <View style={styles.actions}>
        <ActionButton label="Empezar ahora" onPress={() => router.push('/register')} />
        <ActionButton label="Ya tengo una cuenta" variant="secondary" onPress={() => router.push('/login')} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  topline: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  hero: { flex: 1, minHeight: 300, justifyContent: 'center', gap: spacing.md },
  mark: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: spacing.md },
  markBar: { width: 7, height: 28, borderRadius: 2, backgroundColor: palette.accent },
  markBarShort: { height: 18, opacity: 0.65 },
  preview: { padding: spacing.lg, marginBottom: spacing.md },
  previewHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  track: { height: 7, backgroundColor: palette.surfaceRaised, borderRadius: 8, overflow: 'hidden' },
  fill: { width: '75%', height: '100%', backgroundColor: palette.accent },
  actions: { gap: spacing.sm },
});