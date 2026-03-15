import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingScreen } from '@/components/onboarding/OnboardingScreen';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useProfileStore } from '@/stores/profile';
import { useAuthStore } from '@/stores/auth';
import { colors } from '@/constants/Colors';

interface ExamEntry {
  courseCode: string;
  examName: string;
  examDate: string;
}

export default function ExamsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { courses, saveExams } = useProfileStore();
  const [exams, setExams] = useState<ExamEntry[]>([]);
  const [currentCourse, setCurrentCourse] = useState('');
  const [currentName, setCurrentName] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  const enrolledCourses = courses.filter(c => c.status === 'enrolled');

  const addExam = () => {
    if (!currentCourse || !currentDate) return;
    setExams([
      ...exams,
      { courseCode: currentCourse, examName: currentName || 'Exam', examDate: currentDate },
    ]);
    setCurrentCourse('');
    setCurrentName('');
    setCurrentDate('');
  };

  const removeExam = (index: number) => {
    setExams(exams.filter((_, i) => i !== index));
  };

  const handleNext = async () => {
    if (!user) return;
    await saveExams(
      user.id,
      exams.map(e => ({
        course_code: e.courseCode,
        exam_date: e.examDate,
        exam_name: e.examName,
      })),
    );
    router.push('/(onboarding)/study-style');
  };

  return (
    <OnboardingScreen
      step={6}
      totalSteps={10}
      title="Any upcoming exams?"
      subtitle="Add exam dates so we can prioritize your study plan. You can skip this and add them later."
      onNext={handleNext}
      onBack={() => router.back()}
      nextLabel={exams.length === 0 ? 'Skip' : 'Continue'}
    >
      {exams.length > 0 && (
        <View style={styles.examList}>
          {exams.map((exam, i) => (
            <View key={i} style={styles.examItem}>
              <View style={styles.examInfo}>
                <Text style={styles.examCourse}>{exam.courseCode}</Text>
                <Text style={styles.examName}>{exam.examName}</Text>
                <Text style={styles.examDate}>{exam.examDate}</Text>
              </View>
              <TouchableOpacity onPress={() => removeExam(i)}>
                <Text style={styles.removeBtn}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={styles.addForm}>
        <Text style={styles.addTitle}>Add an exam</Text>

        <View style={styles.courseSelect}>
          {enrolledCourses
            .filter(c => c.has_clinical === false && c.has_lab === false)
            .map(course => (
              <TouchableOpacity
                key={course.course_code}
                style={[
                  styles.courseChip,
                  currentCourse === course.course_code && styles.courseChipSelected,
                ]}
                onPress={() => setCurrentCourse(course.course_code)}
              >
                <Text
                  style={[
                    styles.courseChipText,
                    currentCourse === course.course_code && styles.courseChipTextSelected,
                  ]}
                >
                  {course.course_code}
                </Text>
              </TouchableOpacity>
            ))}
        </View>

        <Input
          placeholder="Exam name (e.g., Midterm, Final)"
          value={currentName}
          onChangeText={setCurrentName}
          containerStyle={{ marginTop: 12 }}
        />
        <Input
          placeholder="Date (YYYY-MM-DD)"
          value={currentDate}
          onChangeText={setCurrentDate}
          containerStyle={{ marginTop: 12 }}
          keyboardType="numbers-and-punctuation"
        />
        <Button
          title="Add Exam"
          variant="outline"
          onPress={addExam}
          disabled={!currentCourse || !currentDate}
          style={{ marginTop: 12 }}
          fullWidth
        />
      </View>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  examList: {
    gap: 10,
    marginBottom: 24,
  },
  examItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.success[50],
    borderWidth: 1,
    borderColor: colors.success[200],
  },
  examInfo: {
    flex: 1,
  },
  examCourse: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary[500],
  },
  examName: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  examDate: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  removeBtn: {
    fontSize: 14,
    color: colors.error[500],
    fontWeight: '600',
  },
  addForm: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  courseSelect: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  courseChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  courseChipSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  courseChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  courseChipTextSelected: {
    color: colors.primary[500],
  },
});
