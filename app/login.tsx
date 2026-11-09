import { Link, router } from 'expo-router';
import { StyleSheet, TextInput, View } from 'react-native';

import { ActionButton, AppScreen, AppText } from '@/components/ui';
import { palette, spacing } from '@/constants/theme';

export default function LoginScreen() {
  return (
    <AppScreen>
      <Link href="/onboarding" style={styles.back}>‹  Volver</Link>
      <View style={styles.intro}><AppText variant="caption" color={palette.accent}>BIENVENIDO DE VUELTA</AppText><AppText variant="display">Entrena{ '\n' }con enfoque.</AppText><AppText color={palette.muted}>Inicia sesión para continuar con tu progreso.</AppText></View>
      <View style={styles.form}><Field label="Correo electrónico" placeholder="tu@email.com" /><Field label="Contraseña" placeholder="Al menos 8 caracteres" secureTextEntry /><AppText variant="caption" color={palette.muted} style={styles.forgot}>¿Olvidaste tu contraseña?</AppText><ActionButton label="Iniciar sesión" onPress={() => router.replace('/(tabs)')} /></View>
      <View style={styles.footer}><AppText color={palette.muted}>¿Aún no tienes cuenta?</AppText><Link href="/register" style={styles.link}>Crear cuenta</Link></View>
    </AppScreen>
  );
}

function Field({ label, placeholder, secureTextEntry }: { label: string; placeholder: string; secureTextEntry?: boolean }) {
  return <View style={styles.field}><AppText variant="caption">{label}</AppText><TextInput placeholder={placeholder} placeholderTextColor={palette.muted} secureTextEntry={secureTextEntry} autoCapitalize="none" style={styles.input} /></View>;
}

const styles = StyleSheet.create({
  back: { color: palette.muted, fontSize: 14 },
  intro: { minHeight: 235, justifyContent: 'center', gap: spacing.sm },
  form: { gap: spacing.md },
  field: { gap: spacing.xs },
  input: { height: 52, borderRadius: 8, paddingHorizontal: spacing.md, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.border, color: palette.text, fontSize: 15 },
  forgot: { alignSelf: 'flex-end' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: spacing.xs, marginTop: spacing.md },
  link: { color: palette.accent, fontWeight: '700' },
});