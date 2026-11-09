import type { PropsWithChildren, ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { palette, spacing } from '@/constants/theme';

export function AppScreen({ children, scroll = true }: PropsWithChildren<{ scroll?: boolean }>) {
  const content = <View style={styles.content}>{children}</View>;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {scroll ? <ScrollView contentContainerStyle={styles.scrollContent}>{content}</ScrollView> : content}
    </SafeAreaView>
  );
}

export function AppText({
  children,
  variant = 'body',
  color = palette.text,
  style,
}: PropsWithChildren<{ variant?: 'display' | 'title' | 'body' | 'caption'; color?: string; style?: object }>) {
  return <Text style={[styles[variant], { color }, style]}>{children}</Text>;
}

export function ScreenHeading({ eyebrow, title, detail }: { eyebrow?: string; title: string; detail?: string }) {
  return (
    <View style={styles.heading}>
      {eyebrow ? <AppText variant="caption" color={palette.accent}>{eyebrow.toUpperCase()}</AppText> : null}
      <AppText variant="title">{title}</AppText>
      {detail ? <AppText color={palette.muted}>{detail}</AppText> : null}
    </View>
  );
}

export function Surface({ children, style }: PropsWithChildren<{ style?: object }>) {
  return <View style={[styles.surface, style]}>{children}</View>;
}

export function ActionButton({
  label,
  onPress,
  variant = 'primary',
  icon,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'quiet';
  icon?: ReactNode;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.button, styles[`button_${variant}`], pressed && styles.pressed]}>
      {icon}
      <Text style={[styles.buttonText, variant === 'primary' ? styles.primaryButtonText : styles.secondaryButtonText]}>{label}</Text>
    </Pressable>
  );
}

export function Metric({ label, value, suffix }: { label: string; value: string; suffix?: string }) {
  return (
    <Surface style={styles.metric}>
      <AppText variant="title">{value}<AppText variant="caption" color={palette.accent}>{suffix}</AppText></AppText>
      <AppText variant="caption" color={palette.muted}>{label}</AppText>
    </Surface>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  scrollContent: { flexGrow: 1 },
  content: { width: '100%', maxWidth: 720, alignSelf: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: 36, gap: spacing.lg },
  heading: { gap: spacing.xs, marginBottom: spacing.xs },
  display: { fontSize: 36, lineHeight: 42, fontWeight: '800', letterSpacing: 0 },
  title: { fontSize: 23, lineHeight: 29, fontWeight: '700', letterSpacing: 0 },
  body: { fontSize: 15, lineHeight: 22, letterSpacing: 0 },
  caption: { fontSize: 12, lineHeight: 17, fontWeight: '600', letterSpacing: 0 },
  surface: { backgroundColor: palette.surface, borderRadius: 8, borderWidth: 1, borderColor: palette.border, padding: spacing.md, gap: spacing.sm },
  metric: { flex: 1, minWidth: 120, minHeight: 92, justifyContent: 'center' },
  button: { minHeight: 52, borderRadius: 8, paddingHorizontal: spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  button_primary: { backgroundColor: palette.accent },
  button_secondary: { backgroundColor: palette.surfaceRaised, borderWidth: 1, borderColor: palette.border },
  button_quiet: { backgroundColor: 'transparent' },
  buttonText: { fontSize: 15, fontWeight: '700', letterSpacing: 0 },
  primaryButtonText: { color: palette.background },
  secondaryButtonText: { color: palette.text },
  pressed: { opacity: 0.78 },
});