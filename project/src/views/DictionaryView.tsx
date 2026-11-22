import { useState, useMemo } from 'react';
import {
  BookMarked,
  Heart,
  Search,
  Volume2,
  Trash2,
  Layers,
  MessageCircle,
} from 'lucide-react';
import type { Category, UserProgress } from '@/types';
import { categories } from '@/data/vocabulary';
import { useVocabularyProgress } from '@/hooks/useVocabularyProgress';
import { SpeakButton } from '@/components/SpeakButton';
import { ProgressBar } from '@/components/ProgressBar';
import { vocabularyUk } from '@/data/vocabularyUk';
import { formatSavedWordCount } from '@/language';
import { useLanguage } from '@/languageContext';

interface DictionaryViewProps {
  progress: UserProgress;
  toggleFavorite: (cardId: string) => void;
  isFavorite: (cardId: string) => boolean;
  setView: (view: 'flashcards' | 'chat') => void;
}

export function DictionaryView({ progress, toggleFavorite, isFavorite, setView }: DictionaryViewProps) {
  const { language, t } = useLanguage();
  const { availableWords, isNew } = useVocabularyProgress(progress);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'favorites' | 'all' | Category>('all');

  const filteredCards = useMemo(() => {
    let cards = availableWords;

    if (filter === 'favorites') {
      cards = cards.filter((c) => progress.favoriteCardIds.includes(c.id));
    } else if (filter !== 'all') {
      cards = cards.filter((c) => c.category === filter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      cards = cards.filter(
        (c) =>
          c.spanish.toLowerCase().includes(q) ||
          c.english.toLowerCase().includes(q) ||
          c.example.toLowerCase().includes(q) ||
          vocabularyUk[c.id]?.translation.toLowerCase().includes(q) ||
          vocabularyUk[c.id]?.example.toLowerCase().includes(q)
      );
    }

    return cards;
  }, [filter, search, progress.favoriteCardIds, availableWords]);

  const favoriteCards = availableWords.filter((c) => progress.favoriteCardIds.includes(c.id));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-warmyellow-500 rounded-xl flex items-center justify-center">
          <BookMarked className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white">{t('Dictionary')}</h2>
          <p className="text-sm text-gray-400">{t('Browse all words and manage your favorites')}</p>
        </div>
      </div>

      {/* Favorites summary */}
      <div className="bg-gradient-to-r from-coral-50 to-primary-50 dark:from-dark-800 dark:to-dark-700 rounded-2xl p-5 border border-coral-100 dark:border-dark-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-coral-500 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <p className="font-display font-bold text-lg text-gray-900 dark:text-white">
                {formatSavedWordCount(favoriteCards.length, language)}
              </p>
              <p className="text-xs text-gray-400">{t('Tap the heart on any word to save it for review')}</p>
            </div>
          </div>
          {favoriteCards.length > 0 && (
            <button
              onClick={() => setFilter('favorites')}
              className="px-4 py-2 bg-white dark:bg-dark-900 text-coral-600 dark:text-coral-400 rounded-xl font-semibold text-sm border border-coral-200 dark:border-dark-600 hover:bg-coral-50 dark:hover:bg-dark-800 transition-colors"
            >
              {t('View Favorites')}
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('Search words in Spanish or English...')}
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-dark-900 text-gray-900 dark:text-white text-sm rounded-xl border border-gray-200 dark:border-dark-700 outline-none focus:ring-2 focus:ring-primary-400 placeholder-gray-400"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            filter === 'all'
              ? 'gradient-bg text-white'
              : 'bg-white dark:bg-dark-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-dark-700'
          }`}
        >
          {t('All')} ({availableWords.length})
        </button>
        <button
          onClick={() => setFilter('favorites')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
            filter === 'favorites'
              ? 'bg-coral-500 text-white'
              : 'bg-white dark:bg-dark-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-dark-700'
          }`}
        >
          <Heart className="w-3.5 h-3.5" /> {t('Favorites')} ({favoriteCards.length})
        </button>
        {categories.map((cat) => {
          const count = availableWords.filter((c) => c.category === cat.id).length;
          const active = filter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'gradient-bg text-white'
                  : 'bg-white dark:bg-dark-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-dark-700'
              }`}
            >
              {language === 'uk' ? cat.labelUa : cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Results */}
      {filteredCards.length === 0 ? (
        <div className="text-center py-16">
          {filter === 'favorites' ? (
            <>
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-dark-800 rounded-2xl flex items-center justify-center">
                <Heart className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="font-display font-bold text-gray-900 dark:text-white mb-2">{t('No favorites yet')}</h3>
              <p className="text-sm text-gray-400 mb-4">{t('Start adding words to your personal review list')}</p>
              <button
                onClick={() => setView('flashcards')}
                className="px-5 py-2.5 gradient-bg text-white rounded-xl font-semibold text-sm inline-flex items-center gap-2"
              >
                <Layers className="w-4 h-4" /> {t('Browse Flashcards')}
              </button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-dark-800 rounded-2xl flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="font-display font-bold text-gray-900 dark:text-white mb-2">{t('No words found')}</h3>
              <p className="text-sm text-gray-400">{t('Try a different search term')}</p>
            </>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {filteredCards.map((card) => {
            const fav = isFavorite(card.id);
            const studied = progress.studiedCardIds.includes(card.id);
            const cat = categories.find((c) => c.id === card.category);

            return (
              <div
                key={card.id}
                className="bg-white dark:bg-dark-900 rounded-2xl p-4 border border-gray-200 dark:border-dark-700 hover-lift"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-display font-bold text-base text-gray-900 dark:text-white">
                        {card.spanish}
                      </h4>
                      {isNew(card.id) && (
                        <span className="text-[10px] font-bold bg-coral-500 text-white px-2 py-0.5 rounded-full">NEW</span>
                      )}
                      <SpeakButton text={card.spanish} size="sm" />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {language === 'uk' ? vocabularyUk[card.id]?.translation : card.english}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleFavorite(card.id)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      fav
                        ? 'bg-coral-50 dark:bg-dark-800 text-coral-500'
                        : 'text-gray-300 hover:text-coral-500 hover:bg-coral-50 dark:hover:bg-dark-800'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${fav ? 'fill-coral-500' : ''}`} />
                  </button>
                </div>

                <div className="bg-gray-50 dark:bg-dark-800 rounded-xl p-3 mb-3">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{card.example}</p>
                  <p className="text-xs text-gray-400 italic mt-1">
                    {language === 'uk' ? vocabularyUk[card.id]?.example : card.exampleTranslation}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium bg-primary-100 dark:bg-dark-800 text-primary-600 dark:text-primary-400 px-2 py-1 rounded-md">
                    {language === 'uk' ? cat?.labelUa : cat?.label}
                  </span>
                  {studied && (
                    <span className="text-[10px] text-green-500 font-medium flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full" /> {t('Studied')}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AI Tutor hint */}
      <div className="bg-gradient-to-r from-dark-900 to-dark-800 dark:from-dark-800 dark:to-dark-700 rounded-2xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-white text-sm">{t('Practice your saved words')}</p>
            <p className="text-xs text-gray-400">{t('Use them in conversation with the AI tutor')}</p>
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
