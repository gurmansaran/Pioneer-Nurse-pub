import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { colors } from '@/constants/Colors';

interface OnboardingScreenProps {
  step: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  showBack?: boolean;
}

export function OnboardingScreen({
  step,
  totalSteps,
  title,
  subtitle,
  children,
  onNext,
  onBack,
  nextLabel = 'Continue',
  nextDisabled = false,
  showBack = true,
}: OnboardingScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressContainer}>
        <ProgressBar progress={step / totalSteps} />
        <Text style={styles.stepText}>
          {step} of {totalSteps}
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        <View style={styles.content}>{children}</View>
      </ScrollView>

      <View style={styles.footer}>
        {showBack && step > 1 && onBack ? (
          <Button
            title="Back"
            variant="ghost"
            onPress={onBack}
            style={{ flex: 1, marginRight: 12 }}
          />
        ) : (
          <View style={{ flex: 1 }} />
        )}
        {onNext && (
          <Button
            title={nextLabel}
            onPress={onNext}
            disabled={nextDisabled}
            style={{ flex: 2 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  stepText: {
    fontSize: 13,
    color: colors.textTertiary,
    marginTop: 4,
    textAlign: 'right',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 8,
    lineHeight: 22,
  },
  content: {
    marginTop: 32,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
  },
});
