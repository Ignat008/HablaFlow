import type { Flashcard, UserProgress, VocabularyLevel } from '@/types';
import { flashcards } from '@/data/vocabulary';

export const INITIAL_WORD_COUNT = 50;
export const UNLOCK_BATCH_SIZE = 30;
export const UNLOCK_THRESHOLD = 0.78;

export function getWordsByLevel(level: VocabularyLevel): Flashcard[] {
  return flashcards.filter((word) => (word.level ?? 1) === level);
}

export function getInitialAvailableIds(): string[] {
  return flashcards
    .filter((word) => (word.level ?? 1) === 1)
    .slice(0, INITIAL_WORD_COUNT)
    .map((word) => word.id);
}

export function processVocabularyUnlock(progress: UserProgress): UserProgress {
  const learnedCardIds = progress.learnedCardIds ?? [];
  const newCardIds = progress.newCardIds ?? [];
  const availableIds = progress.availableCardIds?.length
    ? progress.availableCardIds
    : getInitialAvailableIds();
  const availableSet = new Set(availableIds);
  const learnedInPool = learnedCardIds.filter((id) => availableSet.has(id)).length;
  const threshold = Math.ceil(availableIds.length * UNLOCK_THRESHOLD);

  if (learnedInPool < threshold) {
    return {
      ...progress,
      availableCardIds: availableIds,
      vocabularyLevel: progress.vocabularyLevel ?? 1,
    };
  }

  let level = progress.vocabularyLevel ?? 1;
  const unlockedIds = new Set(availableIds);
  const candidates = getWordsByLevel(level).filter((word) => !unlockedIds.has(word.id));

  if (candidates.length === 0) {
    if (level < 5) level = (level + 1) as VocabularyLevel;
  }

  const nextCandidates = getWordsByLevel(level).filter((word) => !unlockedIds.has(word.id));
  const unlocked = nextCandidates.slice(0, UNLOCK_BATCH_SIZE).map((word) => word.id);
  if (unlocked.length === 0) return { ...progress, availableCardIds: availableIds };

  const newIds = unlocked.filter((id) => !newCardIds.includes(id));
  return {
    ...progress,
    availableCardIds: [...availableIds, ...unlocked],
    learnedCardIds,
    newCardIds: [...newCardIds, ...newIds],
    vocabularyLevel: level,
    unlockedBatchCount: progress.unlockedBatchCount + 1,
    lastUnlock: { count: unlocked.length, level },
  };
}

export function getAvailableWords(progress: UserProgress): Flashcard[] {
  const available = new Set(progress.availableCardIds?.length ? progress.availableCardIds : getInitialAvailableIds());
  return flashcards.filter((word) => available.has(word.id));
}

export function getRecommendedWords(progress: UserProgress, limit = 20): Flashcard[] {
  const available = getAvailableWords(progress);
  const learned = new Set(progress.learnedCardIds ?? []);
  const newWords = available.filter((word) => !learned.has(word.id));
  const reviewedWords = available.filter((word) => learned.has(word.id));

  const newCount = Math.ceil(limit * 0.6);
  const reviewCount = limit - newCount;
  const selectedNew = newWords.slice(0, newCount);
  const selectedReview = reviewedWords.slice(0, reviewCount);
  const mixed = [...selectedNew, ...selectedReview];

  if (mixed.length < limit) {
    const selected = new Set(mixed.map((word) => word.id));
    available.forEach((word) => {
      if (mixed.length < limit && !selected.has(word.id)) mixed.push(word);
    });
  }
  return mixed;
}
