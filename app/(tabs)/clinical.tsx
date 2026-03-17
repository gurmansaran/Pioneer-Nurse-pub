import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ClinicalPrepCard } from '@/components/clinical/ClinicalPrepCard';
import { useAuthStore } from '@/stores/auth';
import { useProfileStore } from '@/stores/profile';
import { useClinicalStore } from '@/stores/clinical';
import { colors } from '@/constants/Colors';

const unitLabels: Record<string, string> = {
  med_surg: 'Med-Surg',
  labor_delivery: 'Labor & Delivery',
  mother_baby: 'Mother-Baby',
  pediatrics: 'Pediatrics',
  psychiatric: 'Psychiatric',
  icu: 'ICU',
  emergency: 'Emergency',
  community_health: 'Community Health',
  other: 'General',
};

export default function ClinicalScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { profile } = useProfileStore();
  const {
    briefs,
    reflections,
    loading,
    fetchBriefs,
    fetchReflections,
    loadFromCache,
    resetFlow,
  } = useClinicalStore();

  useEffect(() => {
    loadFromCache();
    if (user?.id) {
      fetchBriefs(user.id).catch(() => {});
      fetchReflections(user.id).catch(() => {});
    }
  }, [user?.id]);

  const firstName = profile?.first_name || 'there';

  const handleStartPrep = () => {
    resetFlow();
    router.push('/clinical/unit-select' as any);
  };

  const handleOpenBrief = (briefId: string) => {
    router.push({ pathname: '/clinical/brief' as any, params: { briefId } });
  };

  const handleReflection = (briefId?: string) => {
    router.push({
      pathname: '/clinical/reflection' as any,
      params: briefId ? { briefId } : {},
    });
  };

  // Check for briefs without reflections
  const briefIdsWithReflections = new Set(
    reflections.map((r) => r.brief_id).filter(Boolean),
  );
  const briefsNeedingReflection = briefs.filter(
    (b) => !briefIdsWithReflections.has(b.id),
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Clinical</Text>
      <Text style={styles.subtitle}>
        Prep for your shift, review past briefs, and reflect on your growth.
      </Text>

      {/* Clinical Prep CTA */}
      <ClinicalPrepCard firstName={firstName} onPress={handleStartPrep} />

      {/* Needs Reflection */}
      {briefsNeedingReflection.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reflect on recent clinicals</Text>
          <Text style={styles.sectionHint}>
            You have {briefsNeedingReflection.length} shift{briefsNeedingReflection.length > 1 ? 's' : ''} without a reflection. Taking 2 minutes to reflect helps lock in your learning.
          </Text>
          {briefsNeedingReflection.slice(0, 3).map((brief) => (
            <TouchableOpacity
              key={brief.id}
              onPress={() => handleReflection(brief.id)}
              activeOpacity={0.7}
            >
              <Card style={styles.reflectCard} padding={14}>
                <View style={styles.reflectRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reflectUnit}>
                      {unitLabels[brief.unit_type] || brief.unit_type}
                    </Text>
                    <Text style={styles.reflectDate}>
                      {new Date(brief.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                      {brief.hospital ? ` \u2022 ${brief.hospital}` : ''}
                    </Text>
                  </View>
                  <Badge text="Reflect" variant="warning" />
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Past Briefs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Past Briefs</Text>
        {loading && briefs.length === 0 && (
          <ActivityIndicator
            size="small"
            color={colors.primary[500]}
            style={{ marginTop: 12 }}
          />
        )}
        {!loading && briefs.length === 0 && (
          <Card style={styles.emptyCard} padding={20}>
            <Text style={styles.emptyText}>
              No briefs yet. Start your first clinical prep above and you'll see your briefs here.
            </Text>
          </Card>
        )}
        {briefs.map((brief) => {
          const hasReflection = briefIdsWithReflections.has(brief.id);
          return (
            <TouchableOpacity
              key={brief.id}
              onPress={() => handleOpenBrief(brief.id)}
              activeOpacity={0.7}
            >
              <Card style={styles.briefCard} padding={14}>
                <View style={styles.briefRow}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.briefBadges}>
                      <Badge
                        text={unitLabels[brief.unit_type] || brief.unit_type}
                        variant="info"
                      />
                      {hasReflection && (
                        <Badge text="Reflected" variant="success" />
                      )}
                    </View>
                    <Text style={styles.briefHospital}>
                      {brief.hospital || 'Clinical'}
                    </Text>
                    <Text style={styles.briefDate}>
                      {new Date(brief.created_at).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Text>
                  </View>
                  <Text style={styles.arrow}>{'\u203A'}</Text>
                </View>
              </Card>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Quick Reference */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Reference</Text>
        <Card style={styles.refCard}>
          <Text style={styles.refTitle}>Vital Signs — Adult Ranges</Text>
          <View style={styles.refRow}>
            <Text style={styles.refLabel}>HR</Text>
            <Text style={styles.refValue}>60-100 bpm</Text>
          </View>
          <View style={styles.refRow}>
            <Text style={styles.refLabel}>BP</Text>
            <Text style={styles.refValue}>{'<120/<80 mmHg'}</Text>
          </View>
          <View style={styles.refRow}>
            <Text style={styles.refLabel}>RR</Text>
            <Text style={styles.refValue}>12-20 breaths/min</Text>
          </View>
          <View style={styles.refRow}>
            <Text style={styles.refLabel}>Temp</Text>
            <Text style={styles.refValue}>97.8-99.1 F (36.5-37.3 C)</Text>
          </View>
          <View style={styles.refRow}>
            <Text style={styles.refLabel}>SpO2</Text>
            <Text style={styles.refValue}>95-100%</Text>
          </View>
        </Card>
      </View>
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
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 6,
    lineHeight: 21,
    marginBottom: 20,
  },

  // Sections
  section: {
    marginTop: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  sectionHint: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
    marginTop: -4,
  },

  // Reflect cards
  reflectCard: {
    marginBottom: 8,
  },
  reflectRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reflectUnit: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  reflectDate: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // Brief cards
  briefCard: {
    marginBottom: 8,
  },
  briefRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  briefBadges: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },
  briefHospital: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  briefDate: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  arrow: {
    fontSize: 24,
    color: colors.textTertiary,
    fontWeight: '300',
    paddingLeft: 8,
  },

  // Empty state
  emptyCard: {
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Quick reference
  refCard: {
    marginBottom: 12,
  },
  refTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  refRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  refLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  refValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
});
