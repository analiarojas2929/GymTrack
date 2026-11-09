import { Link, router } from 'expo-router';
import { StyleSheet, TextInput, View } from 'react-native';

import { ActionButton, AppScreen, AppText } from '@/components/ui';
import { palette, spacing } from '@/constants/theme';

export default function RegisterScreen() {
  return (
    <AppScreen>
      <Link href="/onboarding" style={styles.back}>‹  Volver</Link>
      <View style={styles.intro}><AppText variant="caption" color={palette.accent}>TU NUEVO COMIENZO</AppText><AppText variant="display">Crea tu{ '\n' }espacio.</AppText><AppText color={palette.muted}>Tu plan, tus marcas, tu progreso.</AppText></View>
      <View style={styles.form}><Field label="Nombre" placeholder="Cómo te llamas" /><Field label="Correo electrónico" placeholder="tu@email.com" /><Field label="Contraseña" placeholder="Al menos 8 caracteres" secureTextEntry /><ActionButton label="Crear cuenta" onPress={() => router.replace('/(tabs)')} /></View>
      <View style={styles.footer}><AppText color={palette.muted}>¿Ya tienes una cuenta?</AppText><Link href="/login" style={styles.link}>Iniciar sesión</Link></View>
    </AppScreen>
  );
}

function Field({ label, placeholder, secureTextEntry }: { label: string; placeholder: string; secureTextEntry?: boolean }) {
  return <View style={styles.field}><AppText variant="caption">{label}</AppText><TextInput placeholder={placeholder} placeholderTextColor={palette.muted} secureTextEntry={secureTextEntry} autoCapitalize="none" style={styles.input} /></View>;
}

const styles = StyleSheet.create({
  back: { color: palette.muted, fontSize: 14 },
  intro: { minHeight: 210, justifyContent: 'center', gap: spacing.sm },
  form: { gap: spacing.md },
  field: { gap: spacing.xs },
  input: { height: 52, borderRadius: 8, paddingHorizontal: spacing.md, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.border, color: palette.text, fontSize: 15 },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: spacing.xs, marginTop: spacing.md },
  link: { color: palette.accent, fontWeight: '700' },
});