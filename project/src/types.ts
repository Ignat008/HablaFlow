export type Category = 'basics' | 'travel' | 'food' | 'grammar';

export interface Flashcard {
  id: string;
  spanish: string;
  english: string;
  category: Category;
  example: string;
  exampleTranslation: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: Category;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  correction?: string | null;
}

export interface UserProgress {
  xp: number;
  streak: number;
  lastActiveDate: string;
  flashcardsStudied: number;
  quizzesCompleted: number;
  chatMessages: number;
  correctAnswers: number;
  totalAnswers: number;
  studiedCardIds: string[];
  completedQuizIds: string[];
  favoriteCardIds: string[];
}

export interface CategoryInfo {
  id: Category;
  label: string;
  labelUa: string;
  icon: string;
  color: string;
  description: string;
}

export interface LevelInfo {
  level: number;
  name: string;
  nameUa: string;
  minXp: number;
  maxXp: number;
  icon: string;
}

export type View = 'dashboard' | 'flashcards' | 'quiz' | 'dictionary' | 'chat';
