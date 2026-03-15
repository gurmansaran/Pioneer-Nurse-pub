import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { FlashCard } from '@/components/cards/FlashCard';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useAuthStore } from '@/stores/auth';
import { useStudyStore } from '@/stores/study';
import { colors } from '@/constants/Colors';
import type { ReviewQuality } from '@/lib/spaced-repetition';

export default function FlashcardsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { dueCards, fetchDueCards, submitReview } = useStudyStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewedCount, setReviewedCount] = useState(0);
  const totalCards = dueCards.length + reviewedCount;

  useEffect(() => {
    if (user) {
      fetchDueCards(user.id).catch(() => {});
    }
  }, [user?.id]);

  const handleReview = async (quality: ReviewQuality) => {
    if (!user || dueCards.length === 0) return;
    const card = dueCards[0]; // always review first card since it gets removed from list
    await submitReview(user.id, card.id, quality);
    setReviewedCount(prev => prev + 1);
  };

  if (dueCards.length === 0 && totalCards === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No cards due</Text>
          <Text style={styles.emptySubtitle}>
            All caught up! Come back later for more reviews.
          </Text>
          <Button
            title="Go Back"
            variant="outline"
            onPress={() => router.back()}
            style={{ marginTop: 20 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (dueCards.length === 0 && reviewedCount > 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Session Complete!</Text>
          <Text style={styles.emptySubtitle}>
            You reviewed {reviewedCount} cards.
          </Text>
          <Button
            title="Done"
            onPress={() => router.back()}
            style={{ marginTop: 20 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const currentCard = dueCards[0];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ProgressBar progress={totalCards > 0 ? reviewedCount / totalCards : 0} />
        <Text style={styles.counter}>
          {reviewedCount} of {totalCards} reviewed
        </Text>
      </View>

      <FlashCard
        front={currentCard.front}
        back={currentCard.back}
        onReview={handleReview}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  counter: {
    fontSize: 13,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
});
