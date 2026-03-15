import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Button } from '@/components/ui/Button';
import { colors } from '@/constants/Colors';

interface ClozeBlank {
  id: string;
  options: string[];
  correct: string;
}

interface ClozeDropdownProps {
  stem: string; // Text with {{blank_id}} placeholders
  blanks: ClozeBlank[];
  onSubmit: (answers: Record<string, string>, isCorrect: boolean, partialScore: number) => void;
}

export function ClozeDropdown({ stem, blanks, onSubmit }: ClozeDropdownProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [activeBlank, setActiveBlank] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (blankId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [blankId]: value }));
    setActiveBlank(null);
  };

  const handleSubmit = () => {
    let correct = 0;
    for (const blank of blanks) {
      if (answers[blank.id] === blank.correct) correct++;
    }
    const partialScore = blanks.length > 0 ? correct / blanks.length : 0;
    setSubmitted(true);
    onSubmit(answers, partialScore === 1, partialScore);
  };

  // Render stem with inline dropdowns
  const renderStem = () => {
    const parts = stem.split(/(\{\{[^}]+\}\})/);
    return (
      <Text style={styles.stemText}>
        {parts.map((part, i) => {
          const match = part.match(/\{\{(.+)\}\}/);
          if (match) {
            const blankId = match[1];
            const blank = blanks.find(b => b.id === blankId);
            const answer = answers[blankId];
            const isCorrect = submitted && answer === blank?.correct;
            const isWrong = submitted && answer && answer !== blank?.correct;

            return (
              <Text
                key={i}
                style={[
                  styles.dropdown,
                  answer ? styles.dropdownFilled : null,
                  isCorrect ? styles.dropdownCorrect : null,
                  isWrong ? styles.dropdownWrong : null,
                ]}
                onPress={() => !submitted && setActiveBlank(blankId)}
              >
                {answer || '  Select  '}
              </Text>
            );
          }
          return <Text key={i}>{part}</Text>;
        })}
      </Text>
    );
  };

  const activeBlankData = blanks.find(b => b.id === activeBlank);

  return (
    <View style={styles.container}>
      {renderStem()}

      {!submitted && (
        <Button
          title="Submit"
          onPress={handleSubmit}
          disabled={Object.keys(answers).length < blanks.length}
          fullWidth
          style={{ marginTop: 20 }}
        />
      )}

      {/* Dropdown Modal */}
      <Modal visible={!!activeBlank} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setActiveBlank(null)}
          activeOpacity={1}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select an answer</Text>
            <FlatList
              data={activeBlankData?.options || []}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalOption,
                    answers[activeBlank || ''] === item && styles.modalOptionSelected,
                  ]}
                  onPress={() => handleSelect(activeBlank!, item)}
                >
                  <Text style={styles.modalOptionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 4 },
  stemText: { fontSize: 16, color: colors.text, lineHeight: 28 },
  dropdown: {
    backgroundColor: colors.neutral[100],
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 15,
    fontWeight: '600',
    color: colors.textTertiary,
    overflow: 'hidden',
  },
  dropdownFilled: { color: colors.primary[500], borderColor: colors.primary[500], backgroundColor: colors.primary[50] },
  dropdownCorrect: { color: colors.success[700], borderColor: colors.success[500], backgroundColor: colors.success[50] },
  dropdownWrong: { color: colors.error[700], borderColor: colors.error[500], backgroundColor: colors.error[50] },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' },
  modalContent: { backgroundColor: colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '50%' },
  modalTitle: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 16 },
  modalOption: { padding: 14, borderRadius: 10, marginBottom: 6 },
  modalOptionSelected: { backgroundColor: colors.primary[50] },
  modalOptionText: { fontSize: 16, color: colors.text },
});
