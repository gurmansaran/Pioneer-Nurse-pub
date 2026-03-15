import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="name" />
      <Stack.Screen name="campus" />
      <Stack.Screen name="semester" />
      <Stack.Screen name="courses" />
      <Stack.Screen name="exams" />
      <Stack.Screen name="study-style" />
      <Stack.Screen name="pharm-check" />
      <Stack.Screen name="patho-check" />
      <Stack.Screen name="ready" />
    </Stack>
  );
}
