// app/_layout.tsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { C } from "@/constants/theme";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle:         { backgroundColor: C.surface },
          headerTintColor:     C.text,
          headerTitleStyle:    { fontWeight: "700", fontSize: 17 },
          headerShadowVisible: false,
          contentStyle:        { backgroundColor: C.bg },
          animation:           "slide_from_right",
        }}
      >
        <Stack.Screen name="index"    options={{ headerShown: false }} />
        <Stack.Screen name="add"      options={{ title: "New employee", presentation: "modal" }} />
        <Stack.Screen name="edit/[id]" options={{ title: "Edit employee" }} />
      </Stack>
    </>
  );
}