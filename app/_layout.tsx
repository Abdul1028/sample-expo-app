import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { SpaceTheme } from '@/constants/theme';

const LaunchLensTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: SpaceTheme.background,
    card: SpaceTheme.card,
    border: SpaceTheme.border,
    primary: SpaceTheme.accent,
    text: SpaceTheme.text,
  },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={LaunchLensTheme}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: SpaceTheme.background },
          headerTintColor: SpaceTheme.text,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="details/[id]"
          options={{
            title: 'Launch Details',
            headerBackTitle: 'Back',
          }}
        />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
