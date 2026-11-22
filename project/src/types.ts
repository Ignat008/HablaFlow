export type Category = 'basics' | 'travel' | 'food' | 'grammar' | 'work' | 'it' | 'emotions' | 'daily';
export type VocabularyLevel = 1 | 2 | 3 | 4 | 5;

export interface Flashcard {
  id: string;
  spanish: string;
  english: string;
  category: Category;
  example: string;
  exampleTranslation: string;
  level?: VocabularyLevel;
  transcription?: string;
  isNew?: boolean;
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
  availableCardIds: string[];
  learnedCardIds: string[];
  newCardIds: string[];
  vocabularyLevel: VocabularyLevel;
  unlockedBatchCount: number;
  lastUnlock?: {
    count: number;
    level: VocabularyLevel;
  } | null;
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
