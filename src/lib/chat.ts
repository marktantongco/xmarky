'use client';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface UsageInfo {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

// LongCat brand colors — warm violet/purple
export const ACCENT = '#8b5cf6';
export const ACCENT_DIM = 'rgba(139, 92, 246, 0.15)';
export const ACCENT_GLOW = 'rgba(139, 92, 246, 0.25)';
export const STORAGE_KEY = 'xmarky_messages';

// LongCat model info
export const MODEL_INFO = {
  name: 'LongCat-2.0-Preview',
  provider: 'LongCat',
  contextWindow: '1M tokens',
  maxOutput: '128K tokens',
  description: 'High-performance Agentic model with 1M context',
};
