import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { ChatMessage } from '@/types';

const MAX_MESSAGES = 200;

export function useChat() {
  const [messages, setMessages] = useLocalStorage<ChatMessage[]>('hablaflow-chat', []);

  const addMessage = useCallback((msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMsg: ChatMessage = {
      ...msg,
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev.slice(-(MAX_MESSAGES - 1)), newMsg]);
    return newMsg;
  }, [setMessages]);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, [setMessages]);

  return { messages, addMessage, clearChat };
}
