import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingScreen } from '@/components/onboarding/OnboardingScreen';
import { useProfileStore } from '@/stores/profile';
import { useAuthStore } from '@/stores/auth';
import { coursesBySemester, getLectureCourses } from '@/constants/curriculum';
import { colors } from '@/constants/Colors';

export default function CoursesScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { profile, saveCourses } = useProfileStore();
  const semester = profile?.semester || 'semester_5';

  const availableCourses = useMemo(() => getLectureCourses(semester), [semester]);
  const [selectedCodes, setSelectedCodes] = useState<Set<string>>(
    new Set(availableCourses.map(c => c.code)),
  );

  const toggleCourse = (code: string) => {
    setSelectedCodes(prev => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const handleNext = async () => {
    if (!user) return;
    const allSemesterCourses = coursesBySemester[semester];
    const selected = allSemesterCourses.filter(c => {
      // Include if the lecture is selected, or if it's a clinical/lab tied to a selected lecture
      if (selectedCodes.has(c.code)) return true;
      // Include clinical/lab components of selected lectures
      return allSemesterCourses.some(
        parent =>
          selectedCodes.has(parent.code) &&
          (parent.clinicalCode === c.code || parent.labCode === c.code),
      );
    });

    await saveCourses(
      user.id,
      selected.map(c => ({
        course_code: c.code,
        course_name: c.name,
        status: 'enrolled' as const,
        has_clinical: c.component === 'clinical',
        has_lab: c.component === 'lab',
      })),
    );
    router.push('/(onboarding)/exams');
  };

  if (semester === 'pre_nursing') {
    return (
      <OnboardingScreen
        step={5}
        totalSteps={10}
        title="Pre-Nursing Mode"
        subtitle="We'll set you up with TEAS prep content. You can add nursing courses once you start the program."
        onNext={() => router.push('/(onboarding)/exams')}
        onBack={() => router.back()}
      >
        <View style={styles.preNursingBox}>
          <Text style={styles.preNursingText}>
            TEAS prep mode will focus on Reading, Math, Science, and English & Language Usage.
          </Text>
        </View>
      </OnboardingScreen>
    );
  }

  return (
    <OnboardingScreen
      step={5}
      totalSteps={10}
      title="Your courses this semester"
      subtitle="We've pre-selected your courses. Uncheck any you're not taking."
      onNext={handleNext}
      onBack={() => router.back()}
      nextDisabled={selectedCodes.size === 0}
    >
      <View style={styles.courses}>
        {availableCourses.map(course => (
          <TouchableOpacity
            key={course.code}
            style={[
              styles.courseItem,
              selectedCodes.has(course.code) && styles.courseSelected,
            ]}
            onPress={() => toggleCourse(course.code)}
            activeOpacity={0.7}
          >
            <View style={styles.checkbox}>
              {selectedCodes.has(course.code) && (
                <View style={styles.checkboxFill} />
              )}
            </View>
            <View style={styles.courseInfo}>
              <Text style={styles.courseCode}>{course.code}</Text>
              <Text style={styles.courseName}>{course.name}</Text>
              <Text style={styles.courseMeta}>
                {course.sch} SCH
                {course.hasClinical ? ' + Clinical' : ''}
                {course.hasLab ? ' + Lab' : ''}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  courses: {
    gap: 10,
  },
  courseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  courseSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.neutral[300],
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxFill: {
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: colors.primary[500],
  },
  courseInfo: {
    flex: 1,
  },
  courseCode: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary[500],
  },
  courseName: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    marginTop: 2,
  },
  courseMeta: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 2,
  },
  preNursingBox: {
    backgroundColor: colors.info[50],
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.info[200],
  },
  preNursingText: {
    fontSize: 15,
    color: colors.info[700],
    lineHeight: 22,
  },
});
