import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { colors } from '@/constants/Colors';

/**
 * DisclaimerBanner — Short inline disclaimer for AI-generated content.
 *
 * Usage:
 *   <DisclaimerBanner />                          // default short version under AI responses
 *   <DisclaimerBanner variant="full" />            // opens modal with full disclaimer on tap
 *   <DisclaimerBanner variant="short" />           // inline only, no tap interaction
 */

interface DisclaimerBannerProps {
  /** "short" shows inline text only. "full" (default) shows inline text that opens a detail modal on tap. */
  variant?: 'short' | 'full';
}

const SHORT_TEXT = 'For study purposes only. Verify with your instructor.';

const FULL_TEXT_PARAGRAPHS = [
  'Pioneer Nurse is a study aid, not clinical guidance. Content should be verified against your course materials and clinical instructors.',
  'Drug information including hold parameters may vary by institution, patient population, and clinical context. Always follow your clinical site\'s specific protocols.',
  'AI-generated explanations may contain inaccuracies or outdated information. Cross-reference all AI tutor responses with your textbooks and lecture notes.',
  'Not a substitute for professional nursing judgment. Never use app content to make clinical decisions about real patients.',
];

export function DisclaimerBanner({ variant = 'full' }: DisclaimerBannerProps) {
  const [modalVisible, setModalVisible] = useState(false);

  if (variant === 'short') {
    return (
      <View style={styles.container}>
        <Text style={styles.icon}>i</Text>
        <Text style={styles.shortText}>{SHORT_TEXT}</Text>
      </View>
    );
  }

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="View full study disclaimer"
        accessibilityHint="Opens a detailed disclaimer about AI-generated content"
      >
        <Text style={styles.icon}>i</Text>
        <Text style={styles.shortText}>
          {SHORT_TEXT}
          <Text style={styles.moreText}> Learn more</Text>
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalContent}
          >
            <Text style={styles.modalTitle}>Study Disclaimer</Text>

            {FULL_TEXT_PARAGRAPHS.map((paragraph, index) => (
              <Text key={index} style={styles.modalParagraph}>
                {paragraph}
              </Text>
            ))}

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.modalButtonText}>Got it</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.warning[50],
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.warning[200],
  },
  icon: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.warning[700],
    backgroundColor: colors.warning[200],
    width: 20,
    height: 20,
    borderRadius: 10,
    textAlign: 'center',
    lineHeight: 20,
    marginRight: 8,
    marginTop: 1,
    overflow: 'hidden',
  },
  shortText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: colors.warning[700],
  },
  moreText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary[500],
    textDecorationLine: 'underline',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalScroll: {
    flex: 1,
  },
  modalContent: {
    padding: 24,
    paddingTop: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 20,
  },
  modalParagraph: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: colors.primary[500],
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});
