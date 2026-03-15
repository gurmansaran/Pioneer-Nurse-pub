import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useColorScheme } from '@/components/useColorScheme';
import { useAuthStore } from '@/stores/auth';
import { useProfileStore } from '@/stores/profile';

export { ErrorBoundary } from 'expo-router';

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

function useProtectedRoute() {
  const { session, initialized } = useAuthStore();
  const { profile } = useProfileStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[0] === '(onboarding)';

    if (!session) {
      // Not signed in → go to login
      if (!inAuthGroup) {
        router.replace('/(auth)/login');
      }
    } else if (!profile?.onboarding_completed) {
      // Signed in but hasn't finished onboarding
      if (!inOnboarding) {
        router.replace('/(onboarding)/welcome');
      }
    } else {
      // Signed in and onboarded → go to main app
      if (inAuthGroup || inOnboarding) {
        router.replace('/(tabs)');
      }
    }
  }, [session, initialized, profile?.onboarding_completed, segments]);
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const { initialize, initialized } = useAuthStore();
  const { fetchAll } = useProfileStore();
  const { session } = useAuthStore();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (session?.user) {
      fetchAll(session.user.id).catch(() => {});
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (loaded && initialized) {
      SplashScreen.hideAsync();
    }
  }, [loaded, initialized]);

  if (!loaded || !initialized) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RootLayoutNav />
    </QueryClientProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  useProtectedRoute();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
