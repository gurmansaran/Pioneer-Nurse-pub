import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Button } from '@/components/ui/Button';
import { colors } from '@/constants/Colors';

interface HotSpotRegion {
  id: string;
  x: number; // percentage 0-100
  y: number;
  width: number;
  height: number;
  label?: string;
}

interface HotSpotProps {
  stem: string;
  imageUri?: string;
  regions: HotSpotRegion[];
  correctRegions: string[];
  onSubmit: (selectedIds: string[], isCorrect: boolean, partialScore: number) => void;
}

const screenWidth = Dimensions.get('window').width - 48;

export function HotSpot({ stem, imageUri, regions, correctRegions, onSubmit }: HotSpotProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  const toggle = (id: string) => {
    if (submitted) return;
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = () => {
    const selectedArr = Array.from(selected);
    const correctSet = new Set(correctRegions);
    let score = 0;
    for (const id of selectedArr) {
      if (correctSet.has(id)) score++;
      else score--; // penalty for wrong selections
    }
    score = Math.max(0, score);
    const maxScore = correctRegions.length;
    const partialScore = maxScore > 0 ? score / maxScore : 0;
    setSubmitted(true);
    onSubmit(selectedArr, partialScore === 1, partialScore);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.stem}>{stem}</Text>
      <View style={[styles.imageContainer, { width: screenWidth, height: screenWidth * 0.75 }]}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <Text style={styles.placeholderText}>Diagram</Text>
          </View>
        )}
        {regions.map(region => {
          const isSelected = selected.has(region.id);
          const isCorrect = submitted && correctRegions.includes(region.id);
          const isWrong = submitted && isSelected && !correctRegions.includes(region.id);
          const isMissed = submitted && !isSelected && correctRegions.includes(region.id);

          return (
            <TouchableOpacity
              key={region.id}
              style={[
                styles.region,
                {
                  left: `${region.x}%`,
                  top: `${region.y}%`,
                  width: `${region.width}%`,
                  height: `${region.height}%`,
                },
                isSelected && !submitted && styles.regionSelected,
                isCorrect && isSelected && styles.regionCorrect,
                isWrong && styles.regionWrong,
                isMissed && styles.regionMissed,
              ]}
              onPress={() => toggle(region.id)}
            >
              {region.label && (
                <Text style={styles.regionLabel}>{region.label}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
      {!submitted && (
        <Button
          title="Submit"
          onPress={handleSubmit}
          disabled={selected.size === 0}
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
  imageContainer: { position: 'relative', borderRadius: 12, overflow: 'hidden', backgroundColor: colors.neutral[100] },
  image: { width: '100%', height: '100%' },
  placeholderImage: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.neutral[200] },
  placeholderText: { fontSize: 16, color: colors.textTertiary },
  region: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.2)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  regionSelected: { borderColor: colors.primary[500], backgroundColor: 'rgba(139,0,0,0.15)' },
  regionCorrect: { borderColor: colors.success[500], backgroundColor: 'rgba(34,197,94,0.2)' },
  regionWrong: { borderColor: colors.error[500], backgroundColor: 'rgba(239,68,68,0.2)' },
  regionMissed: { borderColor: colors.warning[500], backgroundColor: 'rgba(245,158,11,0.2)' },
  regionLabel: { fontSize: 11, fontWeight: '700', color: colors.text },
});
