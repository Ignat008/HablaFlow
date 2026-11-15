import { useState } from 'react';
import { Square, Volume2 } from 'lucide-react';
import { useLanguage } from '@/languageContext';

interface SpeakButtonProps {
  text: string;
  lang?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SpeakButton({ text, lang = 'es-ES', className = '', size = 'md' }: SpeakButtonProps) {
  const { t } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);
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

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.95;
    setIsSpeaking(true);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    const voices = window.speechSynthesis.getVoices();
    const locale = lang.toLowerCase();
    const languageCode = locale.split('-')[0];
    const exactVoices = voices.filter((voice) => voice.lang.toLowerCase() === locale);
    const matchingVoices = exactVoices.length > 0
      ? exactVoices
      : voices.filter((voice) => voice.lang.toLowerCase().startsWith(`${languageCode}-`));
    const matchingVoice = matchingVoices.find((voice) => voice.default)
      ?? matchingVoices.find((voice) => voice.localService)
      ?? matchingVoices[0];
    if (matchingVoice) utterance.voice = matchingVoice;

    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={speak}
      className={`${sizeClasses[size]} rounded-full bg-primary-500/10 hover:bg-primary-500/20 text-primary-500 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 ${className}`}
      aria-label={t(isSpeaking ? 'Stop speaking' : 'Pronounce')}
      title={t(isSpeaking ? 'Stop speaking' : 'Listen to pronunciation')}
    >
      {isSpeaking ? <Square className="w-3 h-3" fill="currentColor" /> : <Volume2 className={iconSizes[size]} />}
    </button>
  );
}
