import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/stores/auth';
import { useProfileStore } from '@/stores/profile';
import { colors } from '@/constants/Colors';
import { semesterLabels, campusLabels } from '@/constants/curriculum';

export default function ProfileScreen() {
  const router = useRouter();
  const { signOut } = useAuthStore();
  const { profile, courses } = useProfileStore();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  const enrolledCourses = courses.filter(c => c.status === 'enrolled' && !c.has_clinical && !c.has_lab);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {profile?.first_name?.charAt(0)?.toUpperCase() || '?'}
          </Text>
        </View>
        <Text style={styles.name}>{profile?.first_name}</Text>
        <Badge
          text={semesterLabels[profile?.semester || 'semester_5']}
          variant="info"
        />
      </View>

      {/* Info Cards */}
      <Card style={styles.infoCard}>
        <InfoRow label="Campus" value={campusLabels[profile?.campus || 'dallas']} />
        <InfoRow label="Semester" value={semesterLabels[profile?.semester || 'semester_5']} />
        <InfoRow
          label="Pathophysiology"
          value={(profile?.patho_status || 'unknown').replace('_', ' ')}
        />
        <InfoRow
          label="Pharm Confidence"
          value={(profile?.pharm_confidence || 'unknown').replace('_', ' ')}
        />
        <InfoRow
          label="Study Streak"
          value={`${profile?.streak_count || 0} days`}
        />
      </Card>

      {/* Enrolled Courses */}
      <Text style={styles.sectionTitle}>Enrolled Courses</Text>
      <Card style={styles.coursesCard}>
        {enrolledCourses.map(course => (
          <View key={course.id} style={styles.courseRow}>
            <Text style={styles.courseCode}>{course.course_code}</Text>
            <Text style={styles.courseName}>{course.course_name}</Text>
          </View>
        ))}
        {enrolledCourses.length === 0 && (
          <Text style={styles.emptyText}>No courses enrolled</Text>
        )}
      </Card>

      {/* Study Preferences */}
      <Text style={styles.sectionTitle}>Study Preferences</Text>
      <Card style={styles.prefsCard}>
        <View style={styles.prefChips}>
          {(profile?.study_styles || []).map(style => (
            <Badge
              key={style}
              text={style.replace('_', ' ')}
              variant="default"
              style={{ marginRight: 6, marginBottom: 6 }}
            />
          ))}
        </View>
      </Card>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title="Edit Profile"
          variant="outline"
          onPress={() => router.push('/(onboarding)/name')}
          fullWidth
        />
        <Button
          title="Sign Out"
          variant="ghost"
          onPress={handleSignOut}
          fullWidth
          textStyle={{ color: colors.error[500] }}
        />
      </View>
    </ScrollView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
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
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.white,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  infoCard: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textTransform: 'capitalize',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
    marginBottom: 12,
  },
  coursesCard: {
    marginBottom: 16,
  },
  courseRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  courseCode: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary[500],
  },
  courseName: {
    fontSize: 14,
    color: colors.text,
    marginTop: 2,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textTertiary,
    fontStyle: 'italic',
  },
  prefsCard: {
    marginBottom: 24,
  },
  prefChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  actions: {
    gap: 12,
  },
});
