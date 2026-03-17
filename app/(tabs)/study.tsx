import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useProfileStore } from '@/stores/profile';
import { useStudyStore } from '@/stores/study';
import { colors } from '@/constants/Colors';

export default function StudyScreen() {
  const router = useRouter();
  const { profile, courses } = useProfileStore();
  const { dueCards } = useStudyStore();
  const isPreNursing = profile?.semester === 'pre_nursing';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Study Hub</Text>

      {/* Flashcards */}
      <TouchableOpacity onPress={() => router.push('/study/flashcards/' as any)}>
        <Card style={styles.moduleCard}>
          <View style={styles.moduleHeader}>
            <Text style={styles.moduleTitle}>Flashcards</Text>
            {dueCards.length > 0 && (
              <Badge text={`${dueCards.length} due`} variant="warning" />
            )}
          </View>
          <Text style={styles.moduleDesc}>
            Review key concepts with spaced repetition
          </Text>
        </Card>
      </TouchableOpacity>

      {/* Practice Questions */}
      <TouchableOpacity onPress={() => router.push('/study/questions/' as any)}>
        <Card style={styles.moduleCard}>
          <View style={styles.moduleHeader}>
            <Text style={styles.moduleTitle}>Practice Questions</Text>
            <Badge text="NGN Ready" variant="info" />
          </View>
          <Text style={styles.moduleDesc}>
            All 7 NGN item types with partial credit scoring
          </Text>
        </Card>
      </TouchableOpacity>

      {/* Pharmacology */}
      {courses.some(c => c.course_code === 'NURS 3813') && (
        <TouchableOpacity onPress={() => router.push('/study/pharm/' as any)}>
          <Card style={styles.moduleCard}>
            <View style={styles.moduleHeader}>
              <Text style={styles.moduleTitle}>Pharmacology</Text>
              <Badge
                text={profile?.pharm_confidence?.replace('_', ' ') || ''}
                variant={profile?.pharm_confidence === 'lost' ? 'error' : 'default'}
              />
            </View>
            <Text style={styles.moduleDesc}>
              Drug cards, hold parameters, and med math drills
            </Text>
          </Card>
        </TouchableOpacity>
      )}

      {/* Med Math */}
      <TouchableOpacity>
        <Card style={styles.moduleCard}>
          <Text style={styles.moduleTitle}>Med Math Drills</Text>
          <Text style={styles.moduleDesc}>
            IV drip rates, weight-based dosing, unit conversions
          </Text>
          <Badge text="90%+ required" variant="warning" style={{ marginTop: 8 }} />
        </Card>
      </TouchableOpacity>

      {/* TEAS Prep — only for pre-nursing */}
      {isPreNursing && (
        <TouchableOpacity>
          <Card style={styles.moduleCard}>
            <View style={styles.moduleHeader}>
              <Text style={styles.moduleTitle}>TEAS 7 Prep</Text>
              <Badge text="Pre-Nursing" variant="info" />
            </View>
            <Text style={styles.moduleDesc}>
              Practice by section: Reading, Math, Science, English
            </Text>
          </Card>
        </TouchableOpacity>
      )}

      {/* By Course */}
      <Text style={styles.sectionTitle}>By Course</Text>
      {courses
        .filter(c => c.status === 'enrolled' && !c.has_clinical && !c.has_lab)
        .map(course => (
          <TouchableOpacity key={course.id}>
            <Card style={styles.courseCard} padding={14}>
              <Text style={styles.courseCode}>{course.course_code}</Text>
              <Text style={styles.courseName}>{course.course_name}</Text>
            </Card>
          </TouchableOpacity>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
  },
  moduleCard: {
    marginBottom: 12,
  },
  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  moduleDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 24,
    marginBottom: 12,
  },
  courseCard: {
    marginBottom: 8,
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
});
