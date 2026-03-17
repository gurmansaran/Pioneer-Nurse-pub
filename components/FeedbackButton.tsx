import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { colors } from '@/constants/Colors';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth';

/**
 * FeedbackButton — Floating or inline button that opens a feedback modal.
 *
 * Saves feedback to the `feedback` table in Supabase.
 * Shows a confirmation message after successful submission.
 *
 * Usage:
 *   <FeedbackButton />                                   // floating button (bottom-right)
 *   <FeedbackButton variant="inline" />                   // inline button for settings/profile
 *   <FeedbackButton screen="AI Tutor" />                  // tracks which screen feedback came from
 */

interface FeedbackButtonProps {
  /** "floating" (default) renders a fixed-position button. "inline" renders a standard button. */
  variant?: 'floating' | 'inline';
  /** The screen name to record with the feedback for context. */
  screen?: string;
}

export function FeedbackButton({ variant = 'floating', screen }: FeedbackButtonProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { user } = useAuthStore();

  const handleSubmit = async () => {
    if (!message.trim()) {
      Alert.alert('Empty Feedback', 'Please write something before submitting.');
      return;
    }

    if (!user) {
      Alert.alert('Not Signed In', 'Please sign in to send feedback.');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('feedback').insert({
        user_id: user.id,
        message: message.trim(),
        screen: screen || null,
        app_version: '1.0.0',
      });

      if (error) throw error;

      setSubmitted(true);
      setMessage('');

      // Auto-close after showing confirmation
      setTimeout(() => {
        setModalVisible(false);
        setSubmitted(false);
      }, 2000);
    } catch (err: any) {
      Alert.alert(
        'Could Not Send',
        'Something went wrong. Please try again later.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setModalVisible(false);
    setMessage('');
    setSubmitted(false);
  };

  const triggerButton =
    variant === 'floating' ? (
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Send feedback"
      >
        <Text style={styles.floatingButtonText}>?</Text>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        style={styles.inlineButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Send feedback"
      >
        <Text style={styles.inlineButtonText}>Send Feedback</Text>
      </TouchableOpacity>
    );

  return (
    <>
      {triggerButton}

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleClose}
      >
        <SafeAreaView style={styles.modalContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalInner}
          >
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Send Feedback</Text>
              <TouchableOpacity onPress={handleClose} activeOpacity={0.7}>
                <Text style={styles.closeButton}>Cancel</Text>
              </TouchableOpacity>
            </View>

            {submitted ? (
              // Confirmation state
              <View style={styles.confirmationContainer}>
                <Text style={styles.confirmationEmoji}>&#10003;</Text>
                <Text style={styles.confirmationTitle}>
                  Thanks for your feedback!
                </Text>
                <Text style={styles.confirmationSubtitle}>
                  It helps make Pioneer Nurse better for everyone.
                </Text>
              </View>
            ) : (
              // Input state
              <>
                <Text style={styles.modalSubtitle}>
                  Found a bug? Have an idea? Tell us anything. Your feedback
                  goes directly to the developer.
                </Text>

                <TextInput
                  style={styles.textInput}
                  placeholder="What's on your mind?"
                  placeholderTextColor={colors.textTertiary}
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                  maxLength={2000}
                  autoFocus
                />

                <Text style={styles.charCount}>
                  {message.length}/2000
                </Text>

                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    (!message.trim() || submitting) && styles.submitButtonDisabled,
                  ]}
                  onPress={handleSubmit}
                  disabled={!message.trim() || submitting}
                  activeOpacity={0.7}
                >
                  {submitting ? (
                    <ActivityIndicator color={colors.white} size="small" />
                  ) : (
                    <Text style={styles.submitButtonText}>Send Feedback</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  // Floating button
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 100,
  },
  floatingButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
  },

  // Inline button
  inlineButton: {
    backgroundColor: colors.neutral[100],
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  inlineButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalInner: {
    flex: 1,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  closeButton: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary[500],
  },
  modalSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    marginBottom: 20,
  },

  // Text input
  textInput: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    fontSize: 16,
    lineHeight: 22,
    color: colors.text,
    minHeight: 160,
  },
  charCount: {
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: 'right',
    marginTop: 6,
    marginBottom: 20,
  },

  // Submit button
  submitButton: {
    backgroundColor: colors.primary[500],
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },

  // Confirmation
  confirmationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
  },
  confirmationEmoji: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.success[500],
    marginBottom: 16,
    width: 80,
    height: 80,
    lineHeight: 80,
    textAlign: 'center',
    backgroundColor: colors.success[50],
    borderRadius: 40,
    overflow: 'hidden',
  },
  confirmationTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  confirmationSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
