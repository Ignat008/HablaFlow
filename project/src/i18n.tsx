import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Language } from './language';
import { LanguageContext } from './languageContext';

const ukrainian: Record<string, string> = {
  Dashboard: 'Головна',
  Flashcards: 'Картки',
  Quiz: 'Вікторина',
  Dictionary: 'Словник',
  'Learn Spanish': 'Вивчайте іспанську',
  Level: 'Рівень',
  'day streak': 'днів поспіль',
  'AI Tutor Chat': 'Чат з AI-викладачем',
  Theme: 'Тема',
  Language: 'Мова',
  Menu: 'Меню',
  'Toggle theme': 'Змінити тему',
  'Open AI chat': 'Відкрити чат з AI',
  'AI Spanish Tutor': 'AI-викладач іспанської',
  'Online — Ready to help': 'Онлайн — готовий допомогти',
  'Clear chat': 'Очистити чат',
  'Close chat': 'Закрити чат',
  '¡Hola! I\'m your AI Spanish Tutor': '¡Hola! Я ваш AI-викладач іспанської',
  'I can explain grammar, correct your Spanish, practice role-plays, and help you learn. Try one of these:':
    'Я можу пояснювати граматику, виправляти іспанську, допомагати практикувати діалоги та навчатися. Спробуйте запит:',
  'Type in Spanish or English...': 'Пишіть іспанською, англійською або українською...',
  'Send message': 'Надіслати повідомлення',
  'AI tutor provides grammar help, corrections & role-play practice':
    'AI-викладач пояснює граматику, виправляє помилки та допомагає практикувати діалоги',
  'Corrected:': 'Виправлено:',
  Pronounce: 'Вимовити',
  'Listen to pronunciation': 'Прослухати вимову',
  'Stop speaking': 'Зупинити озвучення',
  'Stop response': 'Зупинити відповідь',
  '¡Bienvenido de nuevo!': 'З поверненням!',
  'Ready to learn Spanish today?': 'Готові сьогодні вивчати іспанську?',
  "You're on a {streak}-day streak. Keep the momentum going!":
    'Ви навчаєтеся вже {streak} дн. поспіль. Продовжуйте в тому ж дусі!',
  'Start Learning': 'Почати навчання',
  'Chat with AI Tutor': 'Поспілкуватися з AI-викладачем',
  'Day Streak': 'Серія занять',
  'Total XP': 'Усього XP',
  'Cards Studied': 'Вивчено карток',
  'Quizzes Done': 'Пройдено вікторин',
  'Your Level': 'Ваш рівень',
  'until you reach': 'до наступного рівня:',
  'Maximum level reached! ¡Felicidades! 🏆': 'Досягнуто найвищого рівня! ¡Felicidades! 🏆',
  Accuracy: 'Точність',
  Correct: 'Правильно',
  'Total answered': 'Усього відповідей',
  'Chat messages': 'Повідомлень у чаті',
  'Quick Actions': 'Швидкі дії',
  'Learn new words': 'Вивчайте нові слова',
  'Take a Quiz': 'Пройти вікторину',
  'Test your knowledge': 'Перевірте свої знання',
  'AI Tutor': 'AI-викладач',
  'Chat in Spanish': 'Практикуйте іспанську',
  'Review saved words': 'Повторюйте збережені слова',
  Categories: 'Категорії',
  'Quiz Challenge': 'Вікторина',
  Start: 'Почати',
  'Test your knowledge with {count} questions across all categories.':
    'Перевірте знання у вікторині з {count} запитань за всіма категоріями.',
  questions: 'запитань',
  'Tap a card to flip it and see the translation': 'Натисніть на картку, щоб побачити переклад',
  Spanish: 'Іспанська',
  English: 'Англійська',
  Ukrainian: 'Українська',
  Translation: 'Переклад',
  'Tap to flip': 'Натисніть, щоб перевернути',
  'Listen to example': 'Прослухати приклад',
  Studied: 'Вивчено',
  'Progress in this set': 'Прогрес у цьому наборі',
  'No cards in this category.': 'У цій категорії поки немає карток.',
  All: 'Усі',
  Card: 'Картка',
  of: 'з',
  Flip: 'Перевернути',
  'Previous card': 'Попередня картка',
  'Next card': 'Наступна картка',
  'Want to practice this word?': 'Хочете попрактикувати це слово?',
  'Chat with the AI tutor and use it in a sentence': 'Поспілкуйтеся з AI-викладачем і складіть речення з цим словом',
  'Open Chat': 'Відкрити чат',
  'Test your Spanish knowledge': 'Перевірте знання іспанської',
  'Choose a category': 'Оберіть категорію',
  'All Categories': 'Усі категорії',
  'Start Quiz': 'Почати вікторину',
  'Correct Total': 'Правильних відповідей',
  Wrong: 'Неправильно',
  Score: 'Результат',
  'XP earned': 'XP отримано',
  'Try Again': 'Спробувати ще раз',
  'Back to Setup': 'Назад до налаштувань',
  'Question {current} of {total}': 'Запитання {current} з {total}',
  '¡Excelente! Quiz Complete!': '¡Excelente! Вікторину завершено!',
  'Quiz Complete!': 'Вікторину завершено!',
  'Great job — you\'re mastering Spanish!': 'Чудова робота — ви опановуєте іспанську!',
  'Keep practicing — you\'ll get there!': 'Продовжуйте практикуватися — у вас усе вийде!',
  '¡Correcto!': '¡Correcto! Правильно!',
  'Not quite right...': 'Не зовсім правильно...',
  'See Results': 'Показати результати',
  'Next Question': 'Наступне запитання',
  'Browse all words and manage your favorites': 'Переглядайте слова та керуйте обраним',
  'saved words': 'збережених слів',
  'Tap the heart on any word to save it for review': 'Натисніть на сердечко, щоб зберегти слово для повторення',
  'View Favorites': 'Показати обране',
  'Search words in Spanish or English...': 'Шукати слова іспанською, англійською чи українською...',
  Favorites: 'Обране',
  'No favorites yet': 'Поки немає обраних слів',
  'Start adding words to your personal review list': 'Додавайте слова до особистого списку для повторення',
  'Browse Flashcards': 'Переглянути картки',
  'No words found': 'Слів не знайдено',
  'Try a different search term': 'Спробуйте інший пошуковий запит',
  'Practice your saved words': 'Практикуйте збережені слова',
  'Use them in conversation with the AI tutor': 'Використовуйте їх у розмові з AI-викладачем',
  'Explain ser vs. estar': 'Поясни різницю між ser та estar',
  'Start a restaurant roleplay': 'Почнімо діалог у ресторані',
  'How do I say "Where is the hotel?"': 'Як сказати «Де готель?»',
  'Explain por vs. para': 'Поясни різницю між por та para',
  'What is the subjunctive?': 'Що таке subjuntivo?',
  'Quiero practicar español': 'Quiero practicar español',
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      return localStorage.getItem('hablaflow-language') === 'uk' ? 'uk' : 'en';
    } catch (error) {
      console.error('Unable to read the saved language preference.', error);
      return 'en';
    }
  });

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = language === 'uk' ? 'HablaFlow — Вивчайте іспанську' : 'HablaFlow — Learn Spanish';
    try {
      localStorage.setItem('hablaflow-language', language);
    } catch (error) {
      console.error('Unable to save the language preference.', error);
    }
  }, [language]);

  const t = useCallback(
    (text: string) => language === 'uk' ? ukrainian[text] ?? text : text,
    [language],
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
