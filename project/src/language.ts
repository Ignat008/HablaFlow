export type Language = 'en' | 'uk';

export function formatStreak(streak: number, language: Language) {
  if (language === 'en') return `${streak} day${streak === 1 ? '' : 's'} streak`;

  const lastTwoDigits = streak % 100;
  const lastDigit = streak % 10;
  const unit = lastTwoDigits >= 11 && lastTwoDigits <= 14
    ? 'днів'
    : lastDigit === 1
      ? 'день'
      : lastDigit >= 2 && lastDigit <= 4
        ? 'дні'
        : 'днів';

  return `${streak} ${unit} поспіль`;
}

export function formatQuestionCount(count: number, language: Language) {
  if (language === 'en') return `${count} question${count === 1 ? '' : 's'}`;

  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;
  const unit = lastTwoDigits >= 11 && lastTwoDigits <= 14
    ? 'запитань'
    : lastDigit === 1
      ? 'запитання'
      : lastDigit >= 2 && lastDigit <= 4
        ? 'запитання'
        : 'запитань';

  return `${count} ${unit}`;
}

export function formatSavedWordCount(count: number, language: Language) {
  if (language === 'en') return `${count} saved word${count === 1 ? '' : 's'}`;

  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;
  const phrase = lastTwoDigits >= 11 && lastTwoDigits <= 14
    ? 'збережених слів'
    : lastDigit === 1
      ? 'збережене слово'
      : lastDigit >= 2 && lastDigit <= 4
        ? 'збережені слова'
        : 'збережених слів';

  return `${count} ${phrase}`;
}
