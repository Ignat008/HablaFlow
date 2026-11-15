import { Volume2 } from 'lucide-react';
import { useLanguage } from '@/languageContext';

interface SpeakButtonProps {
  text: string;
  lang?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SpeakButton({ text, lang = 'es-ES', className = '', size = 'md' }: SpeakButtonProps) {
  const { t } = useLanguage();
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const speak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.85;

    const voices = window.speechSynthesis.getVoices();
    const languageCode = lang.split('-')[0].toLowerCase();
    const matchingVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith(languageCode));
    if (matchingVoice) utterance.voice = matchingVoice;

    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={speak}
      className={`${sizeClasses[size]} rounded-full bg-primary-500/10 hover:bg-primary-500/20 text-primary-500 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 ${className}`}
      aria-label={t('Pronounce')}
      title={t('Listen to pronunciation')}
    >
      <Volume2 className={iconSizes[size]} />
    </button>
  );
}
