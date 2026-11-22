import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { UserProgress } from '@/types';
import { XP_REWARDS } from '@/data/levels';
import { getInitialAvailableIds, processVocabularyUnlock } from '@/data/wordManager';

const todayStr = () => new Date().toISOString().split('T')[0];

const defaultProgress: UserProgress = {
  xp: 0,
  streak: 0,
  lastActiveDate: '',
  flashcardsStudied: 0,
  quizzesCompleted: 0,
  chatMessages: 0,
  correctAnswers: 0,
  totalAnswers: 0,
  studiedCardIds: [],
  completedQuizIds: [],
  favoriteCardIds: [],
  availableCardIds: getInitialAvailableIds(),
  learnedCardIds: [],
  newCardIds: getInitialAvailableIds(),
  vocabularyLevel: 1,
  unlockedBatchCount: 0,
  lastUnlock: null,
};

function normalizeProgress(progress: Partial<UserProgress> | null | undefined): UserProgress {
  return {
    ...defaultProgress,
    ...(progress ?? {}),
    studiedCardIds: progress?.studiedCardIds ?? [],
    completedQuizIds: progress?.completedQuizIds ?? [],
    favoriteCardIds: progress?.favoriteCardIds ?? [],
    availableCardIds: progress?.availableCardIds?.length
      ? progress.availableCardIds
      : getInitialAvailableIds(),
    learnedCardIds: progress?.learnedCardIds ?? [],
    newCardIds: progress?.newCardIds ?? getInitialAvailableIds(),
  };
}

export function useProgress() {
  const [storedProgress, setProgress] = useLocalStorage<UserProgress>('hablaflow-progress', defaultProgress);
  const progress = normalizeProgress(storedProgress);

  const updateStreak = useCallback(() => {
    setProgress((prev) => {
      const today = todayStr();
      if (prev.lastActiveDate === today) return prev;

      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const newStreak = prev.lastActiveDate === yesterday ? prev.streak + 1 : 1;

      return {
        ...prev,
        streak: newStreak,
        lastActiveDate: today,
        xp: prev.xp + (newStreak > 1 ? 0 : XP_REWARDS.dailyStreak),
      };
    });
  }, [setProgress]);

  const addXp = useCallback((amount: number) => {
    setProgress((prev) => ({ ...prev, xp: prev.xp + amount }));
  }, [setProgress]);

  const markCardStudied = useCallback((cardId: string) => {
    setProgress((prev) => {
      const base = normalizeProgress(prev);
      const firstStudy = !base.studiedCardIds.includes(cardId);
      const updated = {
        ...base,
        flashcardsStudied: base.flashcardsStudied + (firstStudy ? 1 : 0),
        studiedCardIds: firstStudy ? [...base.studiedCardIds, cardId] : base.studiedCardIds,
        learnedCardIds: base.learnedCardIds.includes(cardId)
          ? base.learnedCardIds
          : [...base.learnedCardIds, cardId],
        newCardIds: base.newCardIds.filter((id) => id !== cardId),
        xp: base.xp + (firstStudy ? XP_REWARDS.flashcard : 0),
      };
      return processVocabularyUnlock(updated);
    });
    updateStreak();
  }, [setProgress, updateStreak]);

  const recordQuizAnswer = useCallback((isCorrect: boolean) => {
    setProgress((prev) => ({
      ...prev,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      totalAnswers: prev.totalAnswers + 1,
      xp: prev.xp + (isCorrect ? XP_REWARDS.quizCorrect : 0),
    }));
  }, [setProgress]);

  const markQuizCompleted = useCallback((quizId: string) => {
    setProgress((prev) => {
      const base = normalizeProgress(prev);
      if (base.completedQuizIds.includes(quizId)) return base;
      return {
        ...base,
        quizzesCompleted: base.quizzesCompleted + 1,
        completedQuizIds: [...base.completedQuizIds, quizId],
        xp: base.xp + XP_REWARDS.quizComplete,
      };
    });
    updateStreak();
  }, [setProgress, updateStreak]);

  const recordChatMessage = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      chatMessages: prev.chatMessages + 1,
      xp: prev.xp + XP_REWARDS.chatMessage,
    }));
    updateStreak();
  }, [setProgress, updateStreak]);

  const toggleFavorite = useCallback((cardId: string) => {
    setProgress((prev) => {
      const base = normalizeProgress(prev);
      const isFav = base.favoriteCardIds.includes(cardId);
      return {
        ...base,
        favoriteCardIds: isFav
          ? base.favoriteCardIds.filter((id) => id !== cardId)
          : [...base.favoriteCardIds, cardId],
        newCardIds: base.newCardIds.filter((id) => id !== cardId),
      };
    });
  }, [setProgress]);

  const isFavorite = useCallback((cardId: string) => {
    return progress.favoriteCardIds.includes(cardId);
  }, [progress.favoriteCardIds]);

  const resetProgress = useCallback(() => {
    setProgress(defaultProgress);
  }, [setProgress]);

  return {
    progress,
    addXp,
    markCardStudied,
    recordQuizAnswer,
    markQuizCompleted,
    recordChatMessage,
    toggleFavorite,
    isFavorite,
    resetProgress,
    updateStreak,
  };
}
