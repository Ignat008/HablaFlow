import { useMemo, useCallback } from 'react';
import type { UserProgress } from '@/types';
import { getAvailableWords, getRecommendedWords } from '@/data/wordManager';

export function useVocabularyProgress(progress: UserProgress) {
  const availableWords = useMemo(() => getAvailableWords(progress), [progress.availableCardIds, progress.learnedCardIds]);
  const recommendedWords = useMemo(() => getRecommendedWords(progress), [progress.availableCardIds, progress.learnedCardIds]);

  const isNew = useCallback((cardId: string) => progress.newCardIds.includes(cardId), [progress.newCardIds]);

  return { availableWords, recommendedWords, isNew };
}
