import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../global.css';

import { useColorScheme } from '@/hooks/use-color-scheme';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  // Force dark mode - this app is designed for dark theme only
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={DarkTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="editor" options={{ title: 'Editor' }} />
          <Stack.Screen name="details" options={{ title: 'Details' }} />
          <Stack.Screen name="export" options={{ title: 'Export' }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="light" backgroundColor="#000000" translucent={false} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
