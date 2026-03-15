import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Button } from '@/components/ui/Button';
import { colors } from '@/constants/Colors';

interface MatrixRow {
  id: string;
  text: string;
}

interface MatrixResponseProps {
  stem: string;
  rows: MatrixRow[];
  columns: string[];
  correctAnswers: Record<string, string[]>; // rowId -> column[]
  onSubmit: (answers: Record<string, string[]>, isCorrect: boolean, partialScore: number) => void;
}

export function MatrixResponse({ stem, rows, columns, correctAnswers, onSubmit }: MatrixResponseProps) {
  const [answers, setAnswers] = useState<Record<string, Set<string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const toggleCell = (rowId: string, column: string) => {
    if (submitted) return;
    setAnswers(prev => {
      const rowSet = new Set(prev[rowId] || []);
      if (rowSet.has(column)) rowSet.delete(column);
      else rowSet.add(column);
      return { ...prev, [rowId]: rowSet };
    });
  };

  const handleSubmit = () => {
    let correctRows = 0;
    for (const row of rows) {
      const selected = Array.from(answers[row.id] || []).sort();
      const correct = (correctAnswers[row.id] || []).sort();
      if (JSON.stringify(selected) === JSON.stringify(correct)) correctRows++;
    }
    const partialScore = rows.length > 0 ? correctRows / rows.length : 0;
    const result: Record<string, string[]> = {};
    for (const [k, v] of Object.entries(answers)) {
      result[k] = Array.from(v);
    }
    setSubmitted(true);
    onSubmit(result, partialScore === 1, partialScore);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.stem}>{stem}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          <View style={styles.headerRow}>
            <View style={styles.rowLabel} />
            {columns.map(col => (
              <View key={col} style={styles.colHeader}>
                <Text style={styles.colHeaderText}>{col}</Text>
              </View>
            ))}
          </View>
          {rows.map(row => (
            <View key={row.id} style={styles.dataRow}>
              <View style={styles.rowLabel}>
                <Text style={styles.rowLabelText}>{row.text}</Text>
              </View>
              {columns.map(col => {
                const isChecked = answers[row.id]?.has(col);
                const isCorrect = submitted && (correctAnswers[row.id] || []).includes(col);
                const isWrong = submitted && isChecked && !isCorrect;
                return (
                  <TouchableOpacity
                    key={col}
                    style={[
                      styles.cell,
                      isChecked && !submitted && styles.cellChecked,
                      submitted && isCorrect && isChecked && styles.cellCorrect,
                      submitted && isWrong && styles.cellWrong,
                      submitted && isCorrect && !isChecked && styles.cellMissed,
                    ]}
                    onPress={() => toggleCell(row.id, col)}
                  >
                    {isChecked && <View style={styles.checkbox} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>
      {!submitted && (
        <Button title="Submit" onPress={handleSubmit} fullWidth style={{ marginTop: 16 }} />
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
  cellChecked: { borderWidth: 2, borderColor: colors.primary[500], backgroundColor: colors.primary[50] },
  cellCorrect: { borderWidth: 2, borderColor: colors.success[500], backgroundColor: colors.success[50] },
  cellWrong: { borderWidth: 2, borderColor: colors.error[500], backgroundColor: colors.error[50] },
  cellMissed: { borderWidth: 2, borderColor: colors.warning[500], backgroundColor: colors.warning[50] },
  checkbox: { width: 14, height: 14, borderRadius: 3, backgroundColor: colors.primary[500] },
});
