import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { NervousSelect } from '@/components/clinical/NervousSelect';
import { useClinicalStore } from '@/stores/clinical';
import { colors } from '@/constants/Colors';

const nervousOptions = [
  'Talking to my patient',
  'Doing assessments',
  'Medications / dosage calc',
  'Charting / documentation',
  'Talking to my instructor',
  'Making a mistake',
  'Not knowing what to do',
  'Time management',
  'I feel ready!',
];

export default function NervousScreen() {
  const router = useRouter();
  const { prepFlow, setNervousAreas } = useClinicalStore();

  const handleToggle = (option: string) => {
    const current = prepFlow.nervousAreas;

    // "I feel ready!" is mutually exclusive with other options
    if (option === 'I feel ready!') {
      if (current.includes(option)) {
        setNervousAreas([]);
      } else {
        setNervousAreas([option]);
      }
      return;
    }

    // Deselect "I feel ready!" if selecting anything else
    const filtered = current.filter((a) => a !== 'I feel ready!');

    if (filtered.includes(option)) {
      setNervousAreas(filtered.filter((a) => a !== option));
    } else {
      setNervousAreas([...filtered, option]);
    }
  };

  const handleNext = () => {
    router.push('/clinical/generating' as any);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ProgressBar progress={0.8} style={styles.progress} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>What are you most nervous about?</Text>
        <Text style={styles.subtitle}>
          Be honest — everyone feels this way. We'll personalize your brief to help with exactly these things.
        </Text>

        <NervousSelect
          options={nervousOptions}
          selected={prepFlow.nervousAreas}
          onToggle={handleToggle}
        />

        <Text style={styles.reassurance}>
          Feeling nervous before clinical is completely normal. It means you care about doing a good job. We're going to help you walk in ready.
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Build My Brief"
          onPress={handleNext}
          disabled={prepFlow.nervousAreas.length === 0}
          fullWidth
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  progress: {
    marginHorizontal: 20,
    marginTop: 8,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 21,
    marginBottom: 24,
  },
  reassurance: {
    marginTop: 28,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
});
