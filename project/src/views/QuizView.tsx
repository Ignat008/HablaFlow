import { useState, useMemo, useCallback } from 'react';
import {
  Brain,
  Check,
  X,
  ArrowRight,
  Trophy,
  RotateCw,
  Sparkles,
  Target,
  Award,
} from 'lucide-react';
import type { Category, UserProgress } from '@/types';
import { categories } from '@/data/vocabulary';
import { quizQuestions, getQuizByCategory } from '@/data/quizData';
import { Confetti } from '@/components/Confetti';
import { ProgressBar } from '@/components/ProgressBar';
import { SpeakButton } from '@/components/SpeakButton';

interface QuizViewProps {
  progress: UserProgress;
  recordQuizAnswer: (isCorrect: boolean) => void;
  markQuizCompleted: (quizId: string) => void;
}

type QuizState = 'setup' | 'playing' | 'finished';

export function QuizView({ progress, recordQuizAnswer, markQuizCompleted }: QuizViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [state, setState] = useState<QuizState>('setup');
  const [questions, setQuestions] = useState(quizQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredIds, setAnsweredIds] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const startQuiz = useCallback(() => {
    const qs = getQuizByCategory(selectedCategory);
    // Shuffle questions
    const shuffled = [...qs].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setScore(0);
    setAnsweredIds([]);
    setState('playing');
  }, [selectedCategory]);

  const handleAnswer = useCallback((optionIndex: number) => {
    if (showFeedback) return;
    setSelectedOption(optionIndex);
    setShowFeedback(true);

    const correct = optionIndex === questions[currentIndex].correctIndex;
    if (correct) setScore((s) => s + 1);
    recordQuizAnswer(correct);

    setAnsweredIds((prev) => {
      const updated = [...prev, questions[currentIndex].id];
      if (updated.length === questions.length) {
        markQuizCompleted(questions[currentIndex].id);
      }
      return updated;
    });
  }, [showFeedback, questions, currentIndex, recordQuizAnswer, markQuizCompleted]);

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      setState('finished');
      if (score >= questions.length * 0.7) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    }
  }, [currentIndex, questions.length, score]);

  const handleRestart = useCallback(() => {
    setState('setup');
    setShowConfetti(false);
  }, []);

  const currentQuestion = questions[currentIndex];
  const percent = questions.length > 0 ? (score / questions.length) * 100 : 0;

  // SETUP SCREEN
  if (state === 'setup') {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-coral-500 rounded-xl flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white">Quiz Challenge</h2>
            <p className="text-sm text-gray-400">Test your Spanish knowledge</p>
          </div>
        </div>

        {/* Stats */}
        {progress.totalAnswers > 0 && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white dark:bg-dark-900 rounded-2xl p-4 border border-gray-200 dark:border-dark-700 text-center">
              <p className="text-2xl font-display font-bold text-gray-900 dark:text-white">{progress.quizzesCompleted}</p>
              <p className="text-xs text-gray-400 mt-1">Quizzes Done</p>
            </div>
            <div className="bg-white dark:bg-dark-900 rounded-2xl p-4 border border-gray-200 dark:border-dark-700 text-center">
              <p className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                {progress.totalAnswers > 0
                  ? Math.round((progress.correctAnswers / progress.totalAnswers) * 100)
                  : 0}%
              </p>
              <p className="text-xs text-gray-400 mt-1">Accuracy</p>
            </div>
            <div className="bg-white dark:bg-dark-900 rounded-2xl p-4 border border-gray-200 dark:border-dark-700 text-center">
              <p className="text-2xl font-display font-bold text-gray-900 dark:text-white">{progress.correctAnswers}</p>
              <p className="text-xs text-gray-400 mt-1">Correct Total</p>
            </div>
          </div>
        )}

        {/* Category selection */}
        <div className="bg-white dark:bg-dark-900 rounded-2xl p-6 border border-gray-200 dark:border-dark-700">
          <h3 className="font-display font-semibold text-gray-900 dark:text-white mb-4">Choose a category</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                selectedCategory === 'all'
                  ? 'border-coral-500 bg-coral-50 dark:bg-dark-800'
                  : 'border-gray-200 dark:border-dark-700 hover:border-coral-300'
              }`}
            >
              <p className="font-semibold text-gray-900 dark:text-white text-sm">All Categories</p>
              <p className="text-xs text-gray-400 mt-1">{quizQuestions.length} questions</p>
            </button>
            {categories.map((cat) => {
              const count = quizQuestions.filter((q) => q.category === cat.id).length;
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    active
                      ? 'border-coral-500 bg-coral-50 dark:bg-dark-800'
                      : 'border-gray-200 dark:border-dark-700 hover:border-coral-300'
                  }`}
                >
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{cat.label}</p>
                  <p className="text-xs text-gray-400 mt-1">{count} questions</p>
                </button>
              );
            })}
          </div>

          <button
            onClick={startQuiz}
            className="w-full mt-5 py-3.5 gradient-bg text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Sparkles className="w-5 h-5" /> Start Quiz
          </button>
        </div>
      </div>
    );
  }

  // FINISHED SCREEN
  if (state === 'finished') {
    const passed = percent >= 70;
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        <Confetti trigger={showConfetti} />
        <div className="bg-white dark:bg-dark-900 rounded-3xl p-8 border border-gray-200 dark:border-dark-700 text-center">
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
            passed ? 'bg-warmyellow-100 dark:bg-dark-800' : 'bg-gray-100 dark:bg-dark-800'
          }`}>
            {passed ? (
              <Trophy className="w-10 h-10 text-warmyellow-500" />
            ) : (
              <Target className="w-10 h-10 text-gray-400" />
            )}
          </div>

          <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {passed ? '¡Excelente! Quiz Complete!' : 'Quiz Complete!'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {passed
              ? 'Great job — you\'re mastering Spanish!'
              : 'Keep practicing — you\'ll get there!'}
          </p>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-dark-800 rounded-2xl p-4">
              <p className="text-3xl font-display font-bold text-gray-900 dark:text-white">{score}</p>
              <p className="text-xs text-gray-400 mt-1">Correct</p>
            </div>
            <div className="bg-gray-50 dark:bg-dark-800 rounded-2xl p-4">
              <p className="text-3xl font-display font-bold text-coral-500">{questions.length - score}</p>
              <p className="text-xs text-gray-400 mt-1">Wrong</p>
            </div>
            <div className="bg-gray-50 dark:bg-dark-800 rounded-2xl p-4">
              <p className="text-3xl font-display font-bold text-primary-500">{Math.round(percent)}%</p>
              <p className="text-xs text-gray-400 mt-1">Score</p>
            </div>
          </div>

          {/* XP earned */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <Award className="w-5 h-5 text-warmyellow-500" />
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              +{score * 10 + (answeredIds.length >= questions.length ? 20 : 0)} XP earned
            </span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={startQuiz}
              className="flex-1 py-3 gradient-bg text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <RotateCw className="w-4 h-4" /> Try Again
            </button>
            <button
              onClick={handleRestart}
              className="flex-1 py-3 bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors"
            >
              Back to Setup
            </button>
          </div>
        </div>
      </div>
    );
  }

  // PLAYING SCREEN
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <Confetti trigger={showConfetti} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-coral-500 rounded-xl flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white">Quiz</h2>
            <p className="text-sm text-gray-400">Question {currentIndex + 1} of {questions.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-warmyellow-50 dark:bg-dark-800 rounded-xl">
          <Trophy className="w-4 h-4 text-warmyellow-500" />
          <span className="font-semibold text-sm text-gray-900 dark:text-white">{score}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <ProgressBar
          value={currentIndex + (showFeedback ? 1 : 0)}
          max={questions.length}
          color="gradient-bg"
          height="h-2"
        />
      </div>

      {/* Question card */}
      <div className="bg-white dark:bg-dark-900 rounded-2xl p-6 border border-gray-200 dark:border-dark-700">
        <span className="text-xs font-medium bg-coral-100 dark:bg-dark-800 text-coral-600 dark:text-coral-400 px-3 py-1 rounded-full">
          {categories.find((c) => c.id === currentQuestion.category)?.label}
        </span>
        <h3 className="font-display text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-4 mb-2">
          {currentQuestion.question}
        </h3>
        {currentQuestion.question.match(/[a-zA-Záéíóúñ¿¡]/) && (
          <div className="mb-4">
            <SpeakButton text={currentQuestion.question} size="sm" />
          </div>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3">
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedOption === index;
          const isCorrect = index === currentQuestion.correctIndex;
          const showCorrect = showFeedback && isCorrect;
          const showWrong = showFeedback && isSelected && !isCorrect;

          return (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={showFeedback}
              className={`w-full p-4 rounded-xl border-2 text-left font-medium transition-all flex items-center justify-between ${
                showCorrect
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                  : showWrong
                  ? 'border-coral-500 bg-coral-50 dark:bg-coral-900/20 text-coral-700 dark:text-coral-400 animate-shake'
                  : isSelected
                  ? 'border-primary-500 bg-primary-50 dark:bg-dark-800'
                  : 'border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900 text-gray-700 dark:text-gray-300 hover:border-primary-300'
              } ${showFeedback ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <span className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                  showCorrect ? 'bg-green-500 text-white' :
                  showWrong ? 'bg-coral-500 text-white' :
                  'bg-gray-100 dark:bg-dark-800 text-gray-500'
                }`}>
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </span>
              {showCorrect && <Check className="w-5 h-5 text-green-500" />}
              {showWrong && <X className="w-5 h-5 text-coral-500" />}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div className="animate-slide-up bg-white dark:bg-dark-900 rounded-2xl p-5 border border-gray-200 dark:border-dark-700">
          <div className="flex items-start gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
              selectedOption === currentQuestion.correctIndex
                ? 'bg-green-100 dark:bg-green-900/30'
                : 'bg-coral-100 dark:bg-coral-900/30'
            }`}>
              {selectedOption === currentQuestion.correctIndex ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <X className="w-5 h-5 text-coral-600" />
              )}
            </div>
            <div>
              <p className={`font-semibold text-sm mb-1 ${
                selectedOption === currentQuestion.correctIndex
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-coral-600 dark:text-coral-400'
              }`}>
                {selectedOption === currentQuestion.correctIndex ? '¡Correcto!' : 'Not quite right...'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentQuestion.explanation}
              </p>
            </div>
          </div>
          <button
            onClick={handleNext}
            className="w-full mt-4 py-3 gradient-bg text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            {currentIndex + 1 >= questions.length ? 'See Results' : 'Next Question'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
