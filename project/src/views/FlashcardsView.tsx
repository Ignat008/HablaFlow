import { useState, useMemo, useCallback } from 'react';
import {
  Layers,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Heart,
  Volume2,
  Check,
  MessageCircle,
} from 'lucide-react';
import type { Category, UserProgress } from '@/types';
import { categories, flashcards, getCardsByCategory } from '@/data/vocabulary';
import { SpeakButton } from '@/components/SpeakButton';
import { ProgressBar } from '@/components/ProgressBar';
import { vocabularyUk } from '@/data/vocabularyUk';
import { useLanguage } from '@/languageContext';

interface FlashcardsViewProps {
  progress: UserProgress;
  markCardStudied: (cardId: string) => void;
  toggleFavorite: (cardId: string) => void;
  isFavorite: (cardId: string) => boolean;
  setView: (view: 'chat') => void;
}

export function FlashcardsView({
  progress,
  markCardStudied,
  toggleFavorite,
  isFavorite,
  setView,
}: FlashcardsViewProps) {
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const cards = useMemo(() => getCardsByCategory(selectedCategory), [selectedCategory]);

  const currentCard = cards[currentIndex];

  const handleCategoryChange = useCallback((cat: Category | 'all') => {
    setSelectedCategory(cat);
    setCurrentIndex(0);
    setFlipped(false);
  }, []);

  const handleNext = useCallback(() => {
    if (currentCard) {
      markCardStudied(currentCard.id);
    }
    setFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  }, [cards.length, currentCard, markCardStudied]);

  const handlePrev = useCallback(() => {
    setFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 150);
  }, [cards.length]);

  const handleFlip = useCallback(() => {
    setFlipped((prev) => !prev);
    if (!flipped && currentCard) {
      markCardStudied(currentCard.id);
    }
  }, [flipped, currentCard, markCardStudied]);

  if (!currentCard) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <p className="text-center text-gray-500">{t('No cards in this category.')}</p>
      </div>
    );
  }

  const studiedCount = cards.filter((c) => progress.studiedCardIds.includes(c.id)).length;
  const progressPercent = cards.length > 0 ? (studiedCount / cards.length) * 100 : 0;
  const fav = isFavorite(currentCard.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
          <Layers className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white">{t('Flashcards')}</h2>
          <p className="text-sm text-gray-400">{t('Tap a card to flip it and see the translation')}</p>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleCategoryChange('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            selectedCategory === 'all'
              ? 'gradient-bg text-white shadow-md'
              : 'bg-white dark:bg-dark-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-dark-700 hover:border-primary-300'
          }`}
        >
          {t('All')} ({flashcards.length})
        </button>
        {categories.map((cat) => {
          const count = flashcards.filter((c) => c.category === cat.id).length;
          const active = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'gradient-bg text-white shadow-md'
                  : 'bg-white dark:bg-dark-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-dark-700 hover:border-primary-300'
              }`}
            >
              {language === 'uk' ? cat.labelUa : cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Progress */}
      <div className="bg-white dark:bg-dark-900 rounded-2xl p-4 border border-gray-200 dark:border-dark-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {t('Progress in this set')}
          </span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {studiedCount} / {cards.length}
          </span>
        </div>
        <ProgressBar value={progressPercent} color="gradient-bg" height="h-2" />
      </div>

      {/* Flashcard */}
      <div className="relative">
        <div
          className={`flip-card ${flipped ? 'flipped' : ''} cursor-pointer`}
          onClick={handleFlip}
          style={{ height: '420px' }}
        >
          <div className="flip-card-inner">
            {/* Front - Spanish */}
            <div className="flip-card-front">
              <div className="w-full h-full rounded-3xl gradient-bg p-8 flex flex-col items-center justify-center text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-24 translate-x-24" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16" />
                <div className="absolute top-4 left-4">
                  <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">
                    {language === 'uk'
                      ? categories.find((c) => c.id === currentCard.category)?.labelUa
                      : categories.find((c) => c.id === currentCard.category)?.label}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(currentCard.id);
                    }}
                    className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 ${fav ? 'fill-white' : ''}`}
                    />
                  </button>
                </div>
                <div className="relative text-center">
                  <p className="text-xs uppercase tracking-widest opacity-70 mb-3">{t('Spanish')}</p>
                  <h3 className="font-display text-4xl sm:text-5xl font-bold mb-6">
                    {currentCard.spanish}
                  </h3>
                  <SpeakButton
                    text={currentCard.spanish}
                    size="lg"
                    className="bg-white/20 hover:bg-white/30 text-white"
                  />
                  <p className="text-xs opacity-60 mt-6 flex items-center gap-1 justify-center">
                    <RotateCw className="w-3 h-3" /> {t('Tap to flip')}
                  </p>
                </div>
              </div>
            </div>

            {/* Back - English + example */}
            <div className="flip-card-back">
              <div className="w-full h-full rounded-3xl bg-white dark:bg-dark-900 border-2 border-primary-200 dark:border-dark-600 p-8 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-4 left-4">
                  <span className="text-xs font-medium bg-primary-100 dark:bg-dark-800 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-full">
                    {t('Translation')}
                  </span>
                </div>
                <div className="text-center max-w-md">
                  <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">
                    {language === 'uk' ? t('Ukrainian') : t('English')}
                  </p>
                  <h3 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                    {language === 'uk' ? vocabularyUk[currentCard.id]?.translation : currentCard.english}
                  </h3>
                  <div className="bg-gray-50 dark:bg-dark-800 rounded-2xl p-5 text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {currentCard.example}
                    </p>
                    <p className="text-xs text-gray-400 italic mb-3">
                      {language === 'uk'
                        ? vocabularyUk[currentCard.id]?.example
                        : currentCard.exampleTranslation}
                    </p>
                    <div className="flex items-center gap-2">
                      <SpeakButton text={currentCard.example} size="sm" />
                      <span className="text-xs text-gray-400">{t('Listen to example')}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 justify-center">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Check className="w-3 h-3 text-green-500" /> {t('Studied')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation controls */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handlePrev}
          className="w-12 h-12 rounded-xl bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:border-primary-300 transition-colors"
          aria-label={t('Previous card')}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 text-center">
          <p className="text-sm text-gray-400">
            {t('Card')} <span className="font-semibold text-gray-900 dark:text-white">{currentIndex + 1}</span> {t('of')} {cards.length}
          </p>
        </div>

        <button
          onClick={handleFlip}
          className="px-5 py-3 rounded-xl gradient-bg text-white font-medium text-sm flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <RotateCw className="w-4 h-4" /> {t('Flip')}
        </button>

        <button
          onClick={handleNext}
          className="w-12 h-12 rounded-xl bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:border-primary-300 transition-colors"
          aria-label={t('Next card')}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* AI Tutor hint */}
      <div className="bg-gradient-to-r from-dark-900 to-dark-800 dark:from-dark-800 dark:to-dark-700 rounded-2xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-white text-sm">{t('Want to practice this word?')}</p>
            <p className="text-xs text-gray-400">{t('Chat with the AI tutor and use it in a sentence')}</p>
          </div>
        </div>
        <button
          onClick={() => setView('chat')}
          className="px-4 py-2 bg-white text-dark-900 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-colors"
        >
          {t('Open Chat')}
        </button>
      </div>
    </div>
  );
}
