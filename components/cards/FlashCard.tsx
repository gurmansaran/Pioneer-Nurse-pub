import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { colors } from '@/constants/Colors';
import { getReviewButtonColors, type ReviewQuality } from '@/lib/spaced-repetition';

interface FlashCardProps {
  front: string;
  back: string;
  onReview: (quality: ReviewQuality) => void;
}

const { width } = Dimensions.get('window');

export function FlashCard({ front, back, onReview }: FlashCardProps) {
  const [flipped, setFlipped] = useState(false);
  const buttonColors = getReviewButtonColors();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => setFlipped(!flipped)}
        activeOpacity={0.95}
      >
        <Text style={styles.tapHint}>
          {flipped ? 'Tap to see question' : 'Tap to reveal answer'}
        </Text>
        <Text style={styles.cardText}>
          {flipped ? back : front}
        </Text>
      </TouchableOpacity>

      {flipped && (
        <View style={styles.buttons}>
          {(['again', 'hard', 'good', 'easy'] as ReviewQuality[]).map(quality => (
            <TouchableOpacity
              key={quality}
              style={[styles.button, { backgroundColor: buttonColors[quality] }]}
              onPress={() => {
                setFlipped(false);
                onReview(quality);
              }}
            >
              <Text style={styles.buttonText}>
                {quality.charAt(0).toUpperCase() + quality.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: width - 48,
    minHeight: 300,
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  tapHint: {
    position: 'absolute',
    top: 16,
    fontSize: 12,
    color: colors.textTertiary,
  },
  cardText: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 30,
  },
  buttons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 24,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
});
