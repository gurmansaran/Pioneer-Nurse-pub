import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useAuthStore } from '@/stores/auth';
import { useProfileStore } from '@/stores/profile';
import { useChatStore } from '@/stores/chat';
import { colors } from '@/constants/Colors';
import type { Message } from '@/types';

const quickPrompts = [
  'Explain this concept simply',
  'Quiz me on this topic',
  'Give me a case study',
  'Help with drug classifications',
];

export default function TutorScreen() {
  const { user } = useAuthStore();
  const { profile, courses, exams, weakAreas } = useProfileStore();
  const { messages, isTyping, error, sendMessage, clearCurrentConversation } = useChatStore();
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    return () => {
      clearCurrentConversation();
    };
  }, []);

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || !user || !profile) return;
    setInput('');
    await sendMessage(user.id, messageText, profile, courses, exams, weakAreas);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.assistantBubble]}>
        {!isUser && <Text style={styles.assistantLabel}>Pioneer</Text>}
        <Text style={[styles.messageText, isUser ? styles.userText : styles.assistantText]}>
          {item.content}
        </Text>
        {item.model_used && (
          <Text style={styles.modelLabel}>
            {item.model_used === 'claude-sonnet-4-6' ? 'Sonnet' : 'Haiku'}
          </Text>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      {messages.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>
            Hey {profile?.first_name}, I'm Pioneer
          </Text>
          <Text style={styles.emptySubtitle}>
            Your AI study tutor. I know your courses, your semester, and I'm here to help.
          </Text>
          <View style={styles.quickPrompts}>
            {quickPrompts.map((prompt, i) => (
              <TouchableOpacity
                key={i}
                style={styles.quickPrompt}
                onPress={() => handleSend(prompt)}
              >
                <Text style={styles.quickPromptText}>{prompt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
      )}

      {isTyping && (
        <View style={styles.typingIndicator}>
          <ActivityIndicator size="small" color={colors.primary[500]} />
          <Text style={styles.typingText}>Pioneer is thinking...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorBar}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask anything about your courses..."
          placeholderTextColor={colors.textTertiary}
          multiline
          maxLength={2000}
          returnKeyType="send"
          onSubmitEditing={() => handleSend()}
        />
        <TouchableOpacity
          style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
          onPress={() => handleSend()}
          disabled={!input.trim() || isTyping}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  quickPrompts: {
    marginTop: 32,
    gap: 10,
  },
  quickPrompt: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickPromptText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  messageList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary[500],
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: 4,
  },
  assistantLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary[500],
    marginBottom: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: colors.white,
  },
  assistantText: {
    color: colors.text,
  },
  modelLabel: {
    fontSize: 11,
    color: colors.textTertiary,
    marginTop: 6,
    textAlign: 'right',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 8,
  },
  typingText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  errorBar: {
    backgroundColor: colors.error[50],
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  errorText: {
    fontSize: 13,
    color: colors.error[600],
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: colors.neutral[100],
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: colors.primary[500],
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  sendButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 15,
  },
});
