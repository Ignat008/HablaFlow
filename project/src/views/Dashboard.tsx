import {
  Flame,
  Star,
  Brain,
  Layers,
  MessageCircle,
  BookMarked,
  TrendingUp,
  Target,
  ArrowRight,
  Sparkles,
  Trophy,
} from 'lucide-react';
import type { View, UserProgress } from '@/types';
import { categories, flashcards } from '@/data/vocabulary';
import { quizQuestions } from '@/data/quizData';
import { getLevelFromXp, getLevelProgress, getNextLevel, levels } from '@/data/levels';
import { CircularProgress } from '@/components/CircularProgress';
import { ProgressBar } from '@/components/ProgressBar';
import { formatQuestionCount } from '@/language';
import { useLanguage } from '@/languageContext';

interface DashboardProps {
  progress: UserProgress;
  setView: (view: View) => void;
}

export function Dashboard({ progress, setView }: DashboardProps) {
  const { language, t } = useLanguage();
  const level = getLevelFromXp(progress.xp);
  const nextLevel = getNextLevel(progress.xp);
  const levelProgress = getLevelProgress(progress.xp);
  const accuracy = progress.totalAnswers > 0
    ? Math.round((progress.correctAnswers / progress.totalAnswers) * 100)
    : 0;

  const stats = [
    {
      label: 'Day Streak',
      value: progress.streak,
      icon: Flame,
      color: 'coral',
      bg: 'from-coral-50 to-coral-100 dark:from-dark-800 dark:to-dark-700',
      iconBg: 'bg-coral-500',
    },
    {
      label: 'Total XP',
      value: progress.xp,
      icon: Star,
      color: 'warmyellow',
      bg: 'from-warmyellow-50 to-warmyellow-100 dark:from-dark-800 dark:to-dark-700',
      iconBg: 'bg-warmyellow-500',
    },
    {
      label: 'Cards Studied',
      value: progress.flashcardsStudied,
      icon: Layers,
      color: 'primary',
      bg: 'from-primary-50 to-primary-100 dark:from-dark-800 dark:to-dark-700',
      iconBg: 'bg-primary-500',
    },
    {
      label: 'Quizzes Done',
      value: progress.quizzesCompleted,
      icon: Brain,
      color: 'dark',
      bg: 'from-gray-50 to-gray-100 dark:from-dark-800 dark:to-dark-700',
      iconBg: 'bg-dark-700',
    },
  ];

  const quickActions: { label: string; desc: string; icon: typeof Layers; view: View; color: string }[] = [
    { label: 'Flashcards', desc: 'Learn new words', icon: Layers, view: 'flashcards', color: 'gradient-bg' },
    { label: 'Take a Quiz', desc: 'Test your knowledge', icon: Brain, view: 'quiz', color: 'bg-coral-500' },
    { label: 'AI Tutor', desc: 'Chat in Spanish', icon: MessageCircle, view: 'chat', color: 'bg-dark-700' },
    { label: 'Dictionary', desc: 'Review saved words', icon: BookMarked, view: 'dictionary', color: 'bg-warmyellow-500' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Hero greeting */}
      <div className="relative overflow-hidden rounded-3xl gradient-bg p-6 sm:p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full translate-y-20 -translate-x-20" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium opacity-90">{t('¡Bienvenido de nuevo!')}</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2">
              {t('Ready to learn Spanish today?')}
          </h2>
          <p className="text-white/80 text-sm sm:text-base max-w-md">
              {t("You're on a {streak}-day streak. Keep the momentum going!").replace('{streak}', String(progress.streak))}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => setView('flashcards')}
              className="px-5 py-2.5 bg-white text-primary-600 rounded-xl font-semibold text-sm hover:bg-white/90 transition-colors flex items-center gap-2"
            >
              {t('Start Learning')} <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('chat')}
              className="px-5 py-2.5 bg-white/20 backdrop-blur text-white rounded-xl font-semibold text-sm hover:bg-white/30 transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> {t('Chat with AI Tutor')}
            </button>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`bg-gradient-to-br ${stat.bg} rounded-2xl p-5 border border-white/50 dark:border-dark-600 hover-lift`}
            >
              <div className={`w-10 h-10 ${stat.iconBg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t(stat.label)}</p>
            </div>
          );
        })}
      </div>

      {/* Level progress + accuracy */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Level card */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-900 rounded-2xl p-6 border border-gray-200 dark:border-dark-700">
          <div className="flex items-center gap-2 mb-5">
            <Trophy className="w-5 h-5 text-warmyellow-500" />
            <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">{t('Your Level')}</h3>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <CircularProgress
              progress={levelProgress}
              size={130}
              strokeWidth={10}
              color="#FF7A00"
            >
              <div className="text-center">
                <p className="text-3xl font-display font-bold text-gray-900 dark:text-white">{level.level}</p>
                <p className="text-xs text-gray-400">{t('Level')}</p>
              </div>
            </CircularProgress>
            <div className="flex-1 w-full">
              <div className="flex items-baseline justify-between mb-1">
                <span className="font-display font-bold text-xl text-gray-900 dark:text-white">
                  {language === 'uk' ? level.nameUa : level.name}
                </span>
              </div>
              <ProgressBar
                value={progress.xp - level.minXp}
                max={level.maxXp - level.minXp}
                color="gradient-bg"
                height="h-3"
                showLabel
              />
              {nextLevel ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                  <span className="font-semibold text-primary-500">{nextLevel.minXp - progress.xp} XP</span>
                  {' '}{t('until you reach')} <span className="font-semibold">
                    {language === 'uk' ? nextLevel.nameUa : nextLevel.name}
                  </span>
                </p>
              ) : (
                <p className="text-sm text-warmyellow-500 mt-3 font-semibold">
                  {t('Maximum level reached! ¡Felicidades! 🏆')}
                </p>
              )}
            </div>
          </div>

          {/* Level path */}
          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-dark-700">
            <div className="flex items-center justify-between">
              {levels.map((l, i) => {
                const reached = progress.xp >= l.minXp;
                const current = l.level === level.level;
                return (
                  <div key={l.level} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          current
                            ? 'gradient-bg text-white ring-4 ring-primary-100 dark:ring-dark-700 scale-110'
                            : reached
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-200 dark:bg-dark-700 text-gray-400'
                        }`}
                      >
                        {l.level}
                      </div>
                      <span className={`text-[10px] hidden sm:block ${reached ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400'}`}>
                        {language === 'uk' ? l.nameUa : l.name}
                      </span>
                    </div>
                    {i < levels.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-1 ${reached ? 'bg-primary-500' : 'bg-gray-200 dark:bg-dark-700'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Accuracy card */}
        <div className="bg-white dark:bg-dark-900 rounded-2xl p-6 border border-gray-200 dark:border-dark-700">
          <div className="flex items-center gap-2 mb-5">
            <Target className="w-5 h-5 text-coral-500" />
            <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">{t('Accuracy')}</h3>
          </div>
          <div className="flex flex-col items-center">
            <CircularProgress
              progress={accuracy}
              size={130}
              strokeWidth={10}
              color="#FF4B4B"
            >
              <div className="text-center">
                <p className="text-3xl font-display font-bold text-gray-900 dark:text-white">{accuracy}%</p>
                <p className="text-xs text-gray-400">{t('Correct')}</p>
              </div>
            </CircularProgress>
            <div className="mt-4 w-full space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-green-500" /> {t('Correct')}
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">{progress.correctAnswers}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">{t('Total answered')}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{progress.totalAnswers}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">{t('Chat messages')}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{progress.chatMessages}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white mb-4">{t('Quick Actions')}</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => setView(action.view)}
                className="group bg-white dark:bg-dark-900 rounded-2xl p-5 border border-gray-200 dark:border-dark-700 hover-lift text-left"
              >
                <div className={`w-11 h-11 ${action.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">{t(action.label)}</p>
                <p className="text-xs text-gray-400 mt-0.5">{t(action.desc)}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Categories overview */}
      <div>
        <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white mb-4">{t('Categories')}</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const total = flashcards.filter((c) => c.category === cat.id).length;
            const studied = progress.studiedCardIds.filter((id) =>
              flashcards.find((c) => c.id === id && c.category === cat.id)
            ).length;
            const percent = total > 0 ? Math.round((studied / total) * 100) : 0;

            return (
              <button
                key={cat.id}
                onClick={() => setView('flashcards')}
                className="bg-white dark:bg-dark-900 rounded-2xl p-5 border border-gray-200 dark:border-dark-700 hover-lift text-left"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                    <Layers className="w-5 h-5 text-primary-500" />
                  </div>
                  <span className="text-xs font-medium text-gray-400">{studied}/{total}</span>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">
                  {language === 'uk' ? cat.labelUa : cat.label}
                </p>
                <ProgressBar value={percent} color="gradient-bg" height="h-1.5" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Quiz preview */}
      <div className="bg-white dark:bg-dark-900 rounded-2xl p-6 border border-gray-200 dark:border-dark-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary-500" />
            <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">{t('Quiz Challenge')}</h3>
          </div>
          <button
            onClick={() => setView('quiz')}
            className="text-sm font-semibold text-primary-500 hover:text-primary-600 flex items-center gap-1"
          >
            {t('Start')} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {t('Test your knowledge with {count} questions across all categories.').replace('{count}', String(quizQuestions.length))}
        </p>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const count = quizQuestions.filter((q) => q.category === cat.id).length;
            return (
              <span
                key={cat.id}
                className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-dark-800 text-xs font-medium text-gray-600 dark:text-gray-400"
              >
                {language === 'uk' ? cat.labelUa : cat.label}: {formatQuestionCount(count, language)}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
