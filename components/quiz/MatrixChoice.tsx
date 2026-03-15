import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Button } from '@/components/ui/Button';
import { colors } from '@/constants/Colors';

interface MatrixRow {
  id: string;
  text: string;
}

interface MatrixChoiceProps {
  stem: string;
  rows: MatrixRow[];
  columns: string[];
  correctAnswers: Record<string, string>; // rowId -> column
  onSubmit: (answers: Record<string, string>, isCorrect: boolean, partialScore: number) => void;
}

export function MatrixChoice({ stem, rows, columns, correctAnswers, onSubmit }: MatrixChoiceProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const selectCell = (rowId: string, column: string) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [rowId]: column }));
  };

  const handleSubmit = () => {
    let correct = 0;
    for (const row of rows) {
      if (answers[row.id] === correctAnswers[row.id]) correct++;
    }
    const partialScore = rows.length > 0 ? correct / rows.length : 0;
    setSubmitted(true);
    onSubmit(answers, partialScore === 1, partialScore);
  };

  const getCellStyle = (rowId: string, column: string) => {
    const isSelected = answers[rowId] === column;
    if (!submitted) {
      return isSelected ? styles.cellSelected : styles.cell;
    }
    const isCorrect = correctAnswers[rowId] === column;
    if (isCorrect && isSelected) return styles.cellCorrect;
    if (isCorrect && !isSelected) return styles.cellMissed;
    if (!isCorrect && isSelected) return styles.cellWrong;
    return styles.cell;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.stem}>{stem}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.rowLabel} />
            {columns.map(col => (
              <View key={col} style={styles.colHeader}>
                <Text style={styles.colHeaderText}>{col}</Text>
              </View>
            ))}
          </View>
          {/* Rows */}
          {rows.map(row => (
            <View key={row.id} style={styles.dataRow}>
              <View style={styles.rowLabel}>
                <Text style={styles.rowLabelText}>{row.text}</Text>
              </View>
              {columns.map(col => (
                <TouchableOpacity
                  key={col}
                  style={getCellStyle(row.id, col)}
                  onPress={() => selectCell(row.id, col)}
                >
                  {answers[row.id] === col && (
                    <View style={styles.radio} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
      {!submitted && (
        <Button
          title="Submit"
          onPress={handleSubmit}
          disabled={Object.keys(answers).length < rows.length}
          fullWidth
          style={{ marginTop: 16 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 4 },
  stem: { fontSize: 16, fontWeight: '500', color: colors.text, lineHeight: 24, marginBottom: 16 },
  headerRow: { flexDirection: 'row', marginBottom: 4 },
  rowLabel: { width: 140, padding: 8 },
  colHeader: { width: 80, alignItems: 'center', padding: 8 },
  colHeaderText: { fontSize: 13, fontWeight: '700', color: colors.textSecondary, textAlign: 'center' },
  dataRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.neutral[100] },
  rowLabelText: { fontSize: 14, color: colors.text, lineHeight: 20 },
  cell: { width: 80, height: 44, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: 8, margin: 2 },
  cellSelected: { width: 80, height: 44, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.primary[500], borderRadius: 8, margin: 2, backgroundColor: colors.primary[50] },
  cellCorrect: { width: 80, height: 44, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.success[500], borderRadius: 8, margin: 2, backgroundColor: colors.success[50] },
  cellWrong: { width: 80, height: 44, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.error[500], borderRadius: 8, margin: 2, backgroundColor: colors.error[50] },
  cellMissed: { width: 80, height: 44, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.warning[500], borderRadius: 8, margin: 2, backgroundColor: colors.warning[50] },
  radio: { width: 16, height: 16, borderRadius: 8, backgroundColor: colors.primary[500] },
});
