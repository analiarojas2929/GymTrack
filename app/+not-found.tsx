import { Link } from "expo-router";
import { StyleSheet } from "react-native";

import { AppScreen, AppText } from "@/components/ui";
import { palette } from "@/constants/theme";

export default function NotFoundScreen() {
  return (
    <AppScreen scroll={false}>
      <AppText variant="title" style={styles.title}>
        Esta pantalla no existe.
      </AppText>
      <Link href="/" style={styles.link}>
        Volver al inicio
      </Link>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: "auto", textAlign: "center" },
  link: {
    marginTop: "auto",
    color: palette.accent,
    textAlign: "center",
    paddingBottom: 32,
  },
});
