'use client';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const ACCENT = '#76b900';
export const ACCENT_DIM = 'rgba(118, 185, 0, 0.15)';
export const STORAGE_KEY = 'xmarky_messages';
