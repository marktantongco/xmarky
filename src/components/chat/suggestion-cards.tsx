'use client';

import { motion } from 'framer-motion';
import { BookOpen, Code2, Sparkles, Cpu } from 'lucide-react';
import { ACCENT, ACCENT_DIM } from '@/lib/chat';

interface Suggestion {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const suggestions: Suggestion[] = [
  {
    icon: <BookOpen className="size-5" />,
    title: 'Explain quantum computing',
    description: 'Break down complex quantum concepts in simple terms',
  },
  {
    icon: <Code2 className="size-5" />,
    title: 'Write a Python script',
    description: 'Create a useful Python script from scratch',
  },
  {
    icon: <Sparkles className="size-5" />,
    title: 'What is the meaning of life?',
    description: 'Explore philosophical perspectives on existence',
  },
  {
    icon: <Cpu className="size-5" />,
    title: 'Help me brainstorm ideas',
    description: 'Generate creative ideas for your next project',
  },
];

export function SuggestionCards({ onSuggestionClick }: { onSuggestionClick: (title: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto w-full"
    >
      {suggestions.map((suggestion, index) => (
        <motion.button
          key={suggestion.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + index * 0.08 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSuggestionClick(suggestion.title)}
          className="group text-left p-4 rounded-xl border border-white/5 bg-white/[0.03] hover:border-green-500/20 transition-all duration-200 cursor-pointer"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = `${ACCENT}0d`;
            e.currentTarget.style.borderColor = `${ACCENT}33`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '';
            e.currentTarget.style.borderColor = '';
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="flex-shrink-0 p-2 rounded-lg transition-colors"
              style={{ backgroundColor: ACCENT_DIM, color: ACCENT }}
            >
              {suggestion.icon}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
                {suggestion.title}
              </p>
              <p className="text-xs text-gray-500 mt-0.5 truncate">
                {suggestion.description}
              </p>
            </div>
          </div>
        </motion.button>
      ))}
    </motion.div>
  );
}
