import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { AppScreen, AppText, ScreenHeading, Surface } from "@/components/ui";
import { palette, spacing } from "@/constants/theme";

const settings = [
  "Datos personales",
  "Objetivos de entrenamiento",
  "Notificaciones",
  "Privacidad y seguridad",
];

export function ProfileScreen() {
  return (
    <AppScreen>
      <ScreenHeading eyebrow="Tu espacio" title="Perfil" />
      <Surface style={styles.profile}>
        <View style={styles.avatar}>
          <AppText variant="title" color={palette.accent}>
            AR
          </AppText>
        </View>
        <AppText variant="title">Alex Rivera</AppText>
        <AppText color={palette.muted}>alex.rivera@email.com</AppText>
        <View style={styles.level}>
          <AppText variant="caption" color={palette.accent}>
            NIVEL INTERMEDIO
          </AppText>
        </View>
      </Surface>
      <AppText variant="caption" color={palette.muted}>
        CUENTA
      </AppText>
      <Surface style={styles.settings}>
        {settings.map((setting, index) => (
          <Pressable
            key={setting}
            style={[
              styles.setting,
              index < settings.length - 1 && styles.settingBorder,
            ]}
          >
            <AppText>{setting}</AppText>
            <AppText variant="title" color={palette.muted}>
              ›
            </AppText>
          </Pressable>
        ))}
      </Surface>
      <Pressable
        onPress={() => router.replace("/onboarding")}
        style={styles.logout}
      >
        <AppText variant="caption" color={palette.danger}>
          CERRAR SESIÓN
        </AppText>
      </Pressable>
      <AppText variant="caption" color={palette.muted} style={styles.version}>
        GYMTRACK · VERSIÓN 1.0.0
      </AppText>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  profile: { alignItems: "center", paddingVertical: spacing.xl },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: palette.accentDim,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  level: {
    backgroundColor: palette.surfaceRaised,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginTop: spacing.xs,
  },
  settings: { paddingVertical: 0, paddingHorizontal: spacing.md },
  setting: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingBorder: { borderBottomWidth: 1, borderBottomColor: palette.border },
  logout: {
    minHeight: 50,
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },
  version: { textAlign: "center" },
});
