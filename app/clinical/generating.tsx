import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/auth';
import { useProfileStore } from '@/stores/profile';
import { useClinicalStore } from '@/stores/clinical';
import { colors } from '@/constants/Colors';

const encouragingMessages = [
  'Pulling together the key info for your unit...',
  'Reviewing common conditions and medications...',
  'Building your personalized assessment checklist...',
  'Adding documentation tips and instructor hints...',
  'Almost there — putting on the finishing touches...',
];

export default function GeneratingScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { profile } = useProfileStore();
  const { generateBrief } = useClinicalStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const messageIndex = useRef(0);
  const [currentMessage, setCurrentMessage] = React.useState(encouragingMessages[0]);

  useEffect(() => {
    // Animate messages
    const interval = setInterval(() => {
      messageIndex.current =
        (messageIndex.current + 1) % encouragingMessages.length;

      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      setCurrentMessage(encouragingMessages[messageIndex.current]);
    }, 3000);

    // Initial fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const doBuild = async () => {
      try {
        const brief = await generateBrief(user.id);
        router.replace({
          pathname: '/clinical/brief' as any,
          params: { briefId: brief.id },
        });
      } catch (err: any) {
        console.error('Brief generation failed:', err);
        // Go back to nervous screen on error so user can retry
        router.back();
      }
    };

    doBuild();
  }, [user?.id]);

  const firstName = profile?.first_name || 'friend';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <Text style={styles.emoji}>📋</Text>
        <Text style={styles.heading}>
          Building your pre-clinical brief, {firstName}...
        </Text>
        <ActivityIndicator
          size="large"
          color={colors.primary[500]}
          style={styles.spinner}
        />
        <Animated.Text style={[styles.message, { opacity: fadeAnim }]}>
          {currentMessage}
        </Animated.Text>
        <Text style={styles.hint}>
          This usually takes about 10-15 seconds.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  spinner: {
    marginBottom: 24,
  },
  message: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
    minHeight: 42,
  },
  hint: {
    marginTop: 32,
    fontSize: 13,
    color: colors.textTertiary,
  },
});
