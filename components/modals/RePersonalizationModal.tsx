import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { colors } from '@/constants/Colors';

interface RePersonalizationModalProps {
  visible: boolean;
  /** Course that triggered the change */
  courseCode: string;
  courseName: string;
  /** Mastery shift description */
  masteryDirection: 'improved' | 'declined';
  oldMastery: number;
  newMastery: number;
  onUpdatePlan: () => void;
  onKeepPlan: () => void;
  onTellMeMore: () => void;
  onDismiss: () => void;
}

export function RePersonalizationModal({
  visible,
  courseCode,
  courseName,
  masteryDirection,
  oldMastery,
  newMastery,
  onUpdatePlan,
  onKeepPlan,
  onTellMeMore,
  onDismiss,
}: RePersonalizationModalProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const delta = Math.abs(newMastery - oldMastery);
  const isImproved = masteryDirection === 'improved';

  const headlineText = isImproved
    ? `Your progress in ${courseName} has improved!`
    : `Your progress in ${courseName} has changed.`;

  const detailText = isImproved
    ? `Your mastery has gone up by ${delta} points. This is a great sign — you're putting in the work and it's paying off. Want to adjust your study plan to match your new level?`
    : `Your mastery has shifted by ${delta} points. This can happen for lots of reasons — maybe the topics got harder, or life got busy. Want to adjust your study plan so it works better for where you are now?`;

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    // Small delay so user sees the visual feedback
    setTimeout(() => {
      switch (option) {
        case 'update':
          onUpdatePlan();
          break;
        case 'keep':
          onKeepPlan();
          break;
        case 'more':
          onTellMeMore();
          break;
      }
      setSelectedOption(null);
    }, 200);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onDismiss}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Study plan update</Text>
          <TouchableOpacity
            onPress={onDismiss}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.headerDismiss}>Later</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollInner}
          keyboardShouldPersistTaps="handled"
        >
          {/* Mastery shift visual */}
          <View style={styles.shiftVisual}>
            <View style={styles.masteryCircle}>
              <Text style={styles.masteryOld}>{oldMastery}</Text>
              <Text style={styles.masteryLabel}>Before</Text>
            </View>
            <Text style={[styles.arrow, { color: isImproved ? colors.success[500] : colors.warning[500] }]}>
              {isImproved ? '\u2192' : '\u2192'}
            </Text>
            <View style={styles.masteryCircle}>
              <Text style={[styles.masteryNew, { color: isImproved ? colors.success[600] : colors.warning[600] }]}>
                {newMastery}
              </Text>
              <Text style={styles.masteryLabel}>Now</Text>
            </View>
          </View>

          <Text style={styles.headline}>{headlineText}</Text>
          <Text style={styles.detail}>{detailText}</Text>

          {/* Options */}
          <View style={styles.options}>
            <TouchableOpacity
              style={[
                styles.option,
                selectedOption === 'update' && styles.optionSelected,
              ]}
              activeOpacity={0.7}
              onPress={() => handleSelect('update')}
            >
              <Text style={[styles.optionTitle, selectedOption === 'update' && styles.optionTitleSelected]}>
                Update my plan
              </Text>
              <Text style={[styles.optionDesc, selectedOption === 'update' && styles.optionDescSelected]}>
                {isImproved
                  ? 'Increase difficulty and introduce more advanced questions'
                  : 'Focus on building a stronger foundation with core concepts'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.option,
                selectedOption === 'keep' && styles.optionSelected,
              ]}
              activeOpacity={0.7}
              onPress={() => handleSelect('keep')}
            >
              <Text style={[styles.optionTitle, selectedOption === 'keep' && styles.optionTitleSelected]}>
                Keep current plan
              </Text>
              <Text style={[styles.optionDesc, selectedOption === 'keep' && styles.optionDescSelected]}>
                Continue with your existing study settings
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.option,
                selectedOption === 'more' && styles.optionSelected,
              ]}
              activeOpacity={0.7}
              onPress={() => handleSelect('more')}
            >
              <Text style={[styles.optionTitle, selectedOption === 'more' && styles.optionTitleSelected]}>
                Tell me more
              </Text>
              <Text style={[styles.optionDesc, selectedOption === 'more' && styles.optionDescSelected]}>
                See a breakdown of what changed and why
              </Text>
            </TouchableOpacity>
          </View>

          {/* Encouragement note */}
          {!isImproved && (
            <Card style={styles.encouragementCard} padding={14}>
              <Text style={styles.encouragementText}>
                A shift in mastery is completely normal, especially as topics get more complex.
                Adjusting your plan is a smart strategy — not a step back.
              </Text>
            </Card>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 16 : 20,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  headerDismiss: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  scrollContent: {
    flex: 1,
  },
  scrollInner: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },

  // Mastery shift visual
  shiftVisual: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 24,
    paddingVertical: 16,
  },
  masteryCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.neutral[100],
    borderWidth: 2,
    borderColor: colors.border,
  },
  masteryOld: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textSecondary,
  },
  masteryNew: {
    fontSize: 22,
    fontWeight: '800',
  },
  masteryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textTertiary,
    marginTop: 2,
  },
  arrow: {
    fontSize: 24,
    fontWeight: '700',
  },

  headline: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  detail: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 24,
  },

  // Options
  options: {
    gap: 10,
    marginBottom: 20,
  },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  optionSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  optionTitleSelected: {
    color: colors.primary[700],
  },
  optionDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  optionDescSelected: {
    color: colors.primary[600],
  },

  // Encouragement
  encouragementCard: {
    backgroundColor: colors.success[50],
    borderColor: colors.success[200],
  },
  encouragementText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.success[700],
    lineHeight: 20,
  },
});
