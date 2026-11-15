import type { LevelInfo } from '@/types';

export const levels: LevelInfo[] = [
  {
    level: 1,
    name: 'Beginner',
    nameUa: 'Новачок',
    minXp: 0,
    maxXp: 100,
    icon: 'Sprout',
  },
  {
    level: 2,
    name: 'Explorer',
    nameUa: 'Мандрівник',
    minXp: 100,
    maxXp: 300,
    icon: 'Compass',
  },
  {
    level: 3,
    name: 'Conversationalist',
    nameUa: 'Співрозмовник',
    minXp: 300,
    maxXp: 600,
    icon: 'MessageSquare',
  },
  {
    level: 4,
    name: 'Expert',
    nameUa: 'Знавець',
    minXp: 600,
    maxXp: 1000,
    icon: 'GraduationCap',
  },
  {
    level: 5,
    name: 'Master',
    nameUa: 'Майстер',
    minXp: 1000,
    maxXp: 2000,
    icon: 'Crown',
  },
];

export function getLevelFromXp(xp: number): LevelInfo {
  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i].minXp) return levels[i];
  }
  return levels[0];
}

export function getNextLevel(xp: number): LevelInfo | null {
  const current = getLevelFromXp(xp);
  const idx = levels.findIndex((l) => l.level === current.level);
  if (idx < levels.length - 1) return levels[idx + 1];
  return null;
}

export function getLevelProgress(xp: number): number {
  const current = getLevelFromXp(xp);
  const next = getNextLevel(xp);
  if (!next) return 100;
  const range = current.maxXp - current.minXp;
  const progress = xp - current.minXp;
  return Math.min(100, (progress / range) * 100);
}

export const XP_REWARDS = {
  flashcard: 5,
  quizCorrect: 10,
  quizComplete: 20,
  chatMessage: 3,
  dailyStreak: 15,
};
