import { Stack } from 'expo-router';
import { colors } from '@/constants/Colors';

export default function ClinicalLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerBackTitle: 'Back',
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="unit-select"
        options={{ title: 'Clinical Prep', headerShown: true }}
      />
      <Stack.Screen
        name="hospital-select"
        options={{ title: 'Clinical Prep', headerShown: true }}
      />
      <Stack.Screen
        name="patient-info"
        options={{ title: 'Clinical Prep', headerShown: true }}
      />
      <Stack.Screen
        name="nervous"
        options={{ title: 'Clinical Prep', headerShown: true }}
      />
      <Stack.Screen
        name="generating"
        options={{
          title: '',
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="brief"
        options={{
          title: 'Your Brief',
          headerShown: true,
          headerBackTitle: 'Clinical',
        }}
      />
      <Stack.Screen
        name="reflection"
        options={{ title: 'Post-Clinical Reflection', headerShown: true }}
      />
    </Stack>
  );
}
