import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send,
  X,
  MessageCircle,
  Trash2,
  Sparkles,
  Bot,
  User,
  Volume2,
} from 'lucide-react';
import type { ChatMessage } from '@/types';
import { generateAIResponse } from '@/data/aiEngine';
import { useChat } from '@/hooks/useChat';
import { SpeakButton } from '@/components/SpeakButton';
import { useLanguage } from '@/languageContext';

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  recordChatMessage: () => void;
}

const quickPrompts = [
  'Explain ser vs. estar',
  'Start a restaurant roleplay',
  'How do I say "Where is the hotel?"',
  'Explain por vs. para',
  'What is the subjunctive?',
  'Quiero practicar español',
];

function formatMessage(content: string): string[] {
  return content.split('\n');
}

export function ChatWidget({ isOpen, onClose, recordChatMessage }: ChatWidgetProps) {
  const { language, t } = useLanguage();
  const { messages, addMessage, clearChat } = useChat();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text || isTyping) return;

    addMessage({ role: 'user', content: text });
    recordChatMessage();
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking delay
    const delay = 600 + Math.random() * 800;
    setTimeout(() => {
      const response = generateAIResponse(text, messages, language);
      addMessage({
        role: 'assistant',
        content: response.content,
        correction: response.correction,
      });
      setIsTyping(false);
    }, delay);
  }, [input, isTyping, addMessage, recordChatMessage, messages, language]);

  const handleQuickPrompt = useCallback((prompt: string) => {
    setInput(t(prompt));
    inputRef.current?.focus();
  }, [t]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop on mobile */}
      <div
        className="fixed inset-0 bg-black/30 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Chat panel */}
      <div className="fixed bottom-0 right-0 lg:bottom-6 lg:right-6 z-50 w-full lg:w-[440px] h-[85vh] lg:h-[600px] max-h-[700px] bg-white dark:bg-dark-900 lg:rounded-3xl shadow-2xl border border-gray-200 dark:border-dark-700 flex flex-col animate-slide-in-right overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 gradient-bg text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm">{t('AI Spanish Tutor')}</h3>
              <p className="text-xs text-white/70 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                {t('Online — Ready to help')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="w-9 h-9 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label={t('Clear chat')}
                title={t('Clear chat')}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label={t('Close chat')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 bg-gray-50 dark:bg-dark-950">
          {messages.length === 0 && (
            <div className="text-center py-8 animate-fade-in">
              <div className="w-16 h-16 mx-auto mb-4 gradient-bg rounded-2xl flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-display font-bold text-gray-900 dark:text-white mb-2">
                {t('¡Hola! I\'m your AI Spanish Tutor')}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-xs mx-auto">
                {t('I can explain grammar, correct your Spanish, practice role-plays, and help you learn. Try one of these:')}
              </p>
              <div className="grid gap-2 max-w-xs mx-auto">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="px-3 py-2 text-xs font-medium bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300 rounded-xl border border-gray-200 dark:border-dark-700 hover:border-primary-300 transition-colors text-left"
                  >
                    {t(prompt)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-start gap-2 animate-fade-in">
              <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white dark:bg-dark-800 rounded-2xl rounded-tl-sm px-4 py-3 border border-gray-200 dark:border-dark-700">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full typing-dot" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full typing-dot" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full typing-dot" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-white dark:bg-dark-900 border-t border-gray-200 dark:border-dark-700">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('Type in Spanish or English...')}
              className="flex-1 px-4 py-3 bg-gray-100 dark:bg-dark-800 text-gray-900 dark:text-white text-sm rounded-xl border-0 outline-none focus:ring-2 focus:ring-primary-400 placeholder-gray-400"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="w-11 h-11 gradient-bg text-white rounded-xl flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex-shrink-0"
              aria-label={t('Send message')}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 text-center">
            {t('AI tutor provides grammar help, corrections & role-play practice')}
          </p>
        </div>
      </div>
    </>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const { language, t } = useLanguage();
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-2 animate-slide-up ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
        isUser ? 'bg-dark-700 dark:bg-dark-700' : 'gradient-bg'
      }`}>
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`rounded-2xl px-4 py-3 text-sm ${
          isUser
            ? 'bg-dark-900 dark:bg-dark-700 text-white rounded-tr-sm'
            : 'bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-dark-700 rounded-tl-sm'
        }`}>
          {formatMessage(message.content).map((line, i) => (
            <p key={i} className={line.trim() === '' ? 'h-2' : 'mb-1 last:mb-0'}>
              {renderFormattedText(line)}
            </p>
          ))}
          {message.correction && (
            <div className="mt-2 p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-xs text-green-700 dark:text-green-400">
              {t('Corrected:')} {message.correction}
            </div>
          )}
        </div>
        {!isUser && message.content.match(/[a-zA-Záéíóúñ¿¡]/) && (
          <div className="mt-1 ml-1">
            <SpeakButton
              text={message.content.replace(/[*#]/g, '')}
              lang={language === 'uk' ? 'uk-UA' : 'en-US'}
              size="sm"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function renderFormattedText(text: string): React.ReactNode {
  // Simple markdown: **bold** and *italic*
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i} className="italic">{part.slice(1, -1)}</em>;
    }
    return <span key={i}>{part}</span>;
  });
}
