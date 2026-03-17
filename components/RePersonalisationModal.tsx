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
import type { UserCourse } from '@/types';
import type { GradeSelfReport } from '@/types';

interface RePersonalisationModalProps {
  visible: boolean;
  courses: UserCourse[];
  onSubmit: (data: {
    gradeReport: GradeSelfReport;
    focusCourse: string;
    nextExamDate?: string;
  }) => void;
  onDismiss: () => void;
}

const GRADE_OPTIONS: { key: GradeSelfReport; label: string; description: string }[] = [
  { key: 'great', label: 'Great', description: 'Feeling confident about my grades' },
  { key: 'okay', label: 'Okay', description: 'Passing but room for improvement' },
  { key: 'struggling', label: 'Need more support', description: 'Could use extra help in some areas' },
];

export function RePersonalisationModal({
  visible,
  courses,
  onSubmit,
  onDismiss,
}: RePersonalisationModalProps) {
  const [step, setStep] = useState(0);
  const [gradeReport, setGradeReport] = useState<GradeSelfReport | null>(null);
  const [focusCourse, setFocusCourse] = useState<string | null>(null);

  const enrolledCourses = courses.filter(c => c.status === 'enrolled');

  const handleSubmit = () => {
    if (!gradeReport || !focusCourse) return;
    onSubmit({
      gradeReport,
      focusCourse,
    });
    // Reset state for next time
    setStep(0);
    setGradeReport(null);
    setFocusCourse(null);
  };

  const canProceed = () => {
    if (step === 0) return gradeReport !== null;
    if (step === 1) return focusCourse !== null;
    return true;
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepQuestion}>
              How are your grades looking this semester?
            </Text>
            <Text style={styles.stepSubtext}>
              This helps us adjust your study plan — no judgment, just support.
            </Text>
            <View style={styles.options}>
              {GRADE_OPTIONS.map(option => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.gradeOption,
                    gradeReport === option.key && styles.gradeOptionSelected,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => setGradeReport(option.key)}
                >
                  <Text
                    style={[
                      styles.gradeLabel,
                      gradeReport === option.key && styles.gradeLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text
                    style={[
                      styles.gradeDescription,
                      gradeReport === option.key && styles.gradeDescriptionSelected,
                    ]}
                  >
                    {option.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepQuestion}>
              Which course needs the most attention right now?
            </Text>
            <Text style={styles.stepSubtext}>
              We'll prioritize this course in your study plan.
            </Text>
            <View style={styles.options}>
              {enrolledCourses.map(course => (
                <TouchableOpacity
                  key={course.id}
                  style={[
                    styles.courseOption,
                    focusCourse === course.course_code && styles.courseOptionSelected,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => setFocusCourse(course.course_code)}
                >
                  <Text
                    style={[
                      styles.courseCode,
                      focusCourse === course.course_code && styles.courseCodeSelected,
                    ]}
                  >
                    {course.course_code}
                  </Text>
                  <Text
                    style={[
                      styles.courseName,
                      focusCourse === course.course_code && styles.courseNameSelected,
                    ]}
                  >
                    {course.course_name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepQuestion}>All set!</Text>
            <Text style={styles.confirmText}>
              We've updated your study plan based on your answers. You're doing a great job staying on top of things.
            </Text>
            {gradeReport === 'struggling' && (
              <Card style={styles.encouragementCard} padding={14}>
                <Text style={styles.encouragementText}>
                  Nursing school is genuinely hard — needing extra support means you're self-aware, not behind. We'll adjust your plan to build stronger foundations.
                </Text>
              </Card>
            )}
          </View>
        );

      default:
        return null;
    }
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
          <Text style={styles.headerTitle}>Quick study check-in</Text>
          <TouchableOpacity onPress={onDismiss} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.headerDismiss}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Progress dots */}
        <View style={styles.progressDots}>
          {[0, 1, 2].map(i => (
            <View
              key={i}
              style={[
                styles.dot,
                i <= step ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        <ScrollView
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollInner}
          keyboardShouldPersistTaps="handled"
        >
          {renderStep()}
        </ScrollView>

        <View style={styles.footer}>
          {step < 2 ? (
            <Button
              title="Continue"
              variant="primary"
              size="lg"
              fullWidth
              disabled={!canProceed()}
              onPress={() => setStep(step + 1)}
            />
          ) : (
            <Button
              title="Done"
              variant="primary"
              size="lg"
              fullWidth
              onPress={handleSubmit}
            />
          )}
          <Text style={styles.footerNote}>Takes about 30 seconds</Text>
        </View>
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
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: colors.primary[500],
  },
  dotInactive: {
    backgroundColor: colors.neutral[200],
  },
  scrollContent: {
    flex: 1,
  },
  scrollInner: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  stepContent: {
    flex: 1,
  },
  stepQuestion: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  stepSubtext: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 24,
    lineHeight: 21,
  },
  options: {
    gap: 10,
  },
  gradeOption: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  gradeOptionSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  gradeLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  gradeLabelSelected: {
    color: colors.primary[700],
  },
  gradeDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  gradeDescriptionSelected: {
    color: colors.primary[600],
  },
  courseOption: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  courseOptionSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  courseCode: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary[500],
    marginBottom: 2,
  },
  courseCodeSelected: {
    color: colors.primary[700],
  },
  courseName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  courseNameSelected: {
    color: colors.primary[700],
  },
  confirmText: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 16,
  },
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
  footer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  footerNote: {
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: 8,
  },
});
