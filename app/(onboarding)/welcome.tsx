import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { colors } from '@/constants/Colors';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.logo}>Pioneer Nurse</Text>
          <Text style={styles.tagline}>
            Your personal nursing study companion, built for TWU
          </Text>
        </View>

        <View style={styles.features}>
          {[
            { title: 'AI-Powered Tutor', desc: 'Get explanations tailored to your exact courses' },
            { title: 'Smart Flashcards', desc: 'Spaced repetition that adapts to what you know' },
            { title: 'NGN Practice', desc: 'Next Generation NCLEX question formats' },
            { title: 'Clinical Prep', desc: 'Pre-shift briefings for your rotation' },
          ].map((f, i) => (
            <View key={i} style={styles.feature}>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Button
            title="Let's Get Started"
            onPress={() => router.push('/(onboarding)/name')}
            fullWidth
            size="lg"
          />
          <Text style={styles.free}>
            100% free. No ads. No subscriptions. Ever.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 24,
  },
  hero: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.primary[500],
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 26,
    paddingHorizontal: 20,
  },
  features: {
    gap: 20,
  },
  feature: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  featureDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  footer: {
    alignItems: 'center',
  },
  free: {
    fontSize: 13,
    color: colors.textTertiary,
    marginTop: 16,
  },
});
