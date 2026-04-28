'use client';

import { motion } from 'framer-motion';
import { ACCENT } from '@/lib/chat';
import { XmarkyLogo } from './xmarky-logo';

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-start gap-3 px-4"
    >
      <div className="flex-shrink-0 mt-1">
        <XmarkyLogo size={32} />
      </div>
      <div className="bg-[#1e1e32] rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex items-center gap-1.5">
          {[0, 0.15, 0.3].map((delay, i) => (
            <motion.div
              key={i}
              className="size-2 rounded-full"
              style={{ backgroundColor: ACCENT }}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
