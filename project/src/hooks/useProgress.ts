import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { UserProgress } from '@/types';
import { XP_REWARDS } from '@/data/levels';

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
};

export function useProgress() {
  const [progress, setProgress] = useLocalStorage<UserProgress>('hablaflow-progress', defaultProgress);

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
      if (prev.studiedCardIds.includes(cardId)) return prev;
      return {
        ...prev,
        flashcardsStudied: prev.flashcardsStudied + 1,
        studiedCardIds: [...prev.studiedCardIds, cardId],
        xp: prev.xp + XP_REWARDS.flashcard,
      };
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
      if (prev.completedQuizIds.includes(quizId)) return prev;
      return {
        ...prev,
        quizzesCompleted: prev.quizzesCompleted + 1,
        completedQuizIds: [...prev.completedQuizIds, quizId],
        xp: prev.xp + XP_REWARDS.quizComplete,
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
      const isFav = prev.favoriteCardIds.includes(cardId);
      return {
        ...prev,
        favoriteCardIds: isFav
          ? prev.favoriteCardIds.filter((id) => id !== cardId)
          : [...prev.favoriteCardIds, cardId],
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
