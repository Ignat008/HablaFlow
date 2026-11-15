import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import type { View } from '@/types';
import { useTheme } from '@/hooks/useTheme';
import { useProgress } from '@/hooks/useProgress';
import { Navbar } from '@/components/Navbar';
import { ChatWidget } from '@/components/ChatWidget';
import { Dashboard } from '@/views/Dashboard';
import { FlashcardsView } from '@/views/FlashcardsView';
import { QuizView } from '@/views/QuizView';
import { DictionaryView } from '@/views/DictionaryView';

function App() {
  const { theme, toggleTheme } = useTheme();
  const {
    progress,
    markCardStudied,
    recordQuizAnswer,
    markQuizCompleted,
    recordChatMessage,
    toggleFavorite,
    isFavorite,
    updateStreak,
  } = useProgress();

  const [view, setView] = useState<View>('dashboard');
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    updateStreak();
  }, [updateStreak]);

  const handleSetView = (v: View) => {
    if (v === 'chat') {
      setChatOpen(true);
    } else {
      setView(v);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 transition-colors duration-300">
      <Navbar
        currentView={view}
        setView={handleSetView}
        theme={theme}
        toggleTheme={toggleTheme}
        progress={progress}
        onOpenChat={() => setChatOpen(true)}
      />

      {/* Main content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        {view === 'dashboard' && <Dashboard progress={progress} setView={handleSetView} />}
        {view === 'flashcards' && (
          <FlashcardsView
            progress={progress}
            markCardStudied={markCardStudied}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
            setView={() => setChatOpen(true)}
          />
        )}
        {view === 'quiz' && (
          <QuizView
            progress={progress}
            recordQuizAnswer={recordQuizAnswer}
            markQuizCompleted={markQuizCompleted}
          />
        )}
        {view === 'dictionary' && (
          <DictionaryView
            progress={progress}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
            setView={handleSetView}
          />
        )}
      </main>

      {/* Floating chat button */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 gradient-bg text-white rounded-full shadow-xl shadow-primary-500/30 flex items-center justify-center hover:scale-110 transition-transform animate-glow"
          aria-label="Open AI chat"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-coral-500 rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce-in">
            AI
          </span>
        </button>
      )}

      {/* Chat widget */}
      <ChatWidget
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        recordChatMessage={recordChatMessage}
      />
    </div>
  );
}

export default App;
