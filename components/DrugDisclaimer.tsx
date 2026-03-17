import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/Colors';

/**
 * DrugDisclaimer — Disclaimer banner specifically for drug reference cards.
 *
 * Shows a compact warning that drug information (dosages, hold parameters,
 * protocols) may vary by institution and should be verified with clinical
 * instructors and site-specific protocols.
 *
 * Usage:
 *   <DrugDisclaimer />                            // default compact version
 *   <DrugDisclaimer variant="detailed" />          // expanded version with more context
 */

interface DrugDisclaimerProps {
  /** "compact" (default) for inline use on drug cards. "detailed" for full drug reference screens. */
  variant?: 'compact' | 'detailed';
}

export function DrugDisclaimer({ variant = 'compact' }: DrugDisclaimerProps) {
  if (variant === 'compact') {
    return (
      <View style={styles.compactContainer}>
        <Text style={styles.compactIcon}>Rx</Text>
        <Text style={styles.compactText}>
          Hold parameters and protocols may vary by institution. Verify with your clinical site.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.detailedContainer}>
      <Text style={styles.detailedTitle}>Drug Information Disclaimer</Text>
      <Text style={styles.detailedText}>
        Drug information in Pioneer Nurse is intended for educational study purposes only.
        Dosages, hold parameters, administration guidelines, and nursing considerations
        presented here reflect general nursing education content.
      </Text>
      <Text style={styles.detailedText}>
        Protocols vary by institution, patient population, and clinical context.
        Always follow your clinical site's specific policies and verify drug information
        with your instructor, pharmacist, or institutional drug reference before
        administering medications in clinical settings.
      </Text>
      <Text style={styles.detailedEmphasis}>
        This is a study aid, not a clinical drug reference.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // Compact variant
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.info[50],
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.info[200],
  },
  compactIcon: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.info[700],
    backgroundColor: colors.info[200],
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 8,
    marginTop: 1,
    overflow: 'hidden',
  },
  compactText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    color: colors.info[700],
  },

  // Detailed variant
  detailedContainer: {
    backgroundColor: colors.info[50],
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: colors.info[200],
  },
  detailedTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.info[700],
    marginBottom: 8,
  },
  detailedText: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.info[600],
    marginBottom: 8,
  },
  detailedEmphasis: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
    fontStyle: 'italic',
    color: colors.info[700],
    marginTop: 4,
  },
});
