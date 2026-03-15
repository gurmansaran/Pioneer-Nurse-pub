import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from '@/components/ui/Button';
import { colors } from '@/constants/Colors';

interface DragItem {
  id: string;
  text: string;
}

interface DropZone {
  id: string;
  label: string;
}

interface DragAndDropProps {
  stem: string;
  items: DragItem[];
  zones: DropZone[];
  correctPlacements: Record<string, string>; // itemId -> zoneId
  onSubmit: (placements: Record<string, string>, isCorrect: boolean, partialScore: number) => void;
}

export function DragAndDrop({ stem, items, zones, correctPlacements, onSubmit }: DragAndDropProps) {
  const [placements, setPlacements] = useState<Record<string, string>>({}); // itemId -> zoneId
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleItemPress = (itemId: string) => {
    if (submitted) return;
    if (selectedItem === itemId) {
      setSelectedItem(null);
    } else {
      setSelectedItem(itemId);
    }
  };

  const handleZonePress = (zoneId: string) => {
    if (submitted || !selectedItem) return;
    setPlacements(prev => ({ ...prev, [selectedItem]: zoneId }));
    setSelectedItem(null);
  };

  const removeFromZone = (itemId: string) => {
    if (submitted) return;
    setPlacements(prev => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  };

  const handleSubmit = () => {
    let correct = 0;
    let total = Object.keys(correctPlacements).length;
    for (const [itemId, zoneId] of Object.entries(placements)) {
      if (correctPlacements[itemId] === zoneId) correct++;
    }
    const partialScore = total > 0 ? correct / total : 0;
    setSubmitted(true);
    onSubmit(placements, partialScore === 1, partialScore);
  };

  const unplacedItems = items.filter(item => !placements[item.id]);

  return (
    <View style={styles.container}>
      <Text style={styles.stem}>{stem}</Text>

      {/* Unplaced items */}
      <Text style={styles.sectionLabel}>
        {selectedItem ? 'Now tap a category below' : 'Tap an item to place it'}
      </Text>
      <View style={styles.itemPool}>
        {unplacedItems.map(item => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.item,
              selectedItem === item.id && styles.itemSelected,
            ]}
            onPress={() => handleItemPress(item.id)}
          >
            <Text style={styles.itemText}>{item.text}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Drop zones */}
      <View style={styles.zones}>
        {zones.map(zone => {
          const zoneItems = items.filter(item => placements[item.id] === zone.id);
          return (
            <TouchableOpacity
              key={zone.id}
              style={[styles.zone, selectedItem && styles.zoneActive]}
              onPress={() => handleZonePress(zone.id)}
              activeOpacity={selectedItem ? 0.7 : 1}
            >
              <Text style={styles.zoneLabel}>{zone.label}</Text>
              {zoneItems.map(item => {
                const isCorrect = submitted && correctPlacements[item.id] === zone.id;
                const isWrong = submitted && correctPlacements[item.id] !== zone.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.placedItem,
                      isCorrect && styles.placedCorrect,
                      isWrong && styles.placedWrong,
                    ]}
                    onPress={() => removeFromZone(item.id)}
                  >
                    <Text style={styles.placedText}>{item.text}</Text>
                  </TouchableOpacity>
                );
              })}
              {zoneItems.length === 0 && (
                <Text style={styles.zonePlaceholder}>Drop items here</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {!submitted && (
        <Button
          title="Submit"
          onPress={handleSubmit}
          disabled={unplacedItems.length > 0}
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
  sectionLabel: { fontSize: 13, color: colors.textSecondary, marginBottom: 8, fontStyle: 'italic' },
  itemPool: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  item: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, backgroundColor: colors.info[50], borderWidth: 1, borderColor: colors.info[200] },
  itemSelected: { backgroundColor: colors.primary[50], borderColor: colors.primary[500], borderWidth: 2 },
  itemText: { fontSize: 14, fontWeight: '500', color: colors.text },
  zones: { gap: 12 },
  zone: { borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed', borderRadius: 14, padding: 14, minHeight: 80 },
  zoneActive: { borderColor: colors.primary[400], backgroundColor: colors.primary[50] },
  zoneLabel: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 8 },
  zonePlaceholder: { fontSize: 14, color: colors.textTertiary, fontStyle: 'italic' },
  placedItem: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: colors.neutral[100], marginBottom: 4 },
  placedCorrect: { backgroundColor: colors.success[100] },
  placedWrong: { backgroundColor: colors.error[100] },
  placedText: { fontSize: 14, color: colors.text },
});
