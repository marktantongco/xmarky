'use client';

import { motion } from 'framer-motion';
import { Message, ACCENT, ACCENT_DIM } from '@/lib/chat';
import { XmarkyLogo } from './xmarky-logo';
import { CodeBlock } from './code-block';
import ReactMarkdown from 'react-markdown';

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-3 px-4 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="flex-shrink-0 mt-1">
          <XmarkyLogo size={32} />
        </div>
      )}

      <div className={`max-w-[80%] md:max-w-[70%] ${isUser ? 'order-first' : ''}`}>
        <div
          className="rounded-2xl px-4 py-3"
          style={{
            backgroundColor: isUser ? ACCENT : '#1e1e32',
            color: isUser ? '#fff' : '#e5e7eb',
            borderRadius: isUser ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem',
          }}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
          ) : (
            <div
              className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed"
              style={
                {
                  '--tw-prose-headings': ACCENT,
                  '--tw-prose-links': ACCENT,
                  '--tw-prose-bold': '#c4b5fd',
                  '--tw-prose-code': '#a78bfa',
                } as React.CSSProperties
              }
            >
              <ReactMarkdown
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    const isInline = !match;
                    if (isInline) {
                      return (
                        <code
                          className={className}
                          style={{ backgroundColor: ACCENT_DIM, color: ACCENT, padding: '0.125rem 0.25rem', borderRadius: '0.25rem' }}
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    }
                    return (
                      <CodeBlock language={match[1]}>
                        {String(children).replace(/\n$/, '')}
                      </CodeBlock>
                    );
                  },
                  pre({ children }) {
                    return <>{children}</>;
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
        <p className={`text-[10px] text-gray-500 mt-1 ${isUser ? 'text-right mr-1' : 'ml-1'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {isUser && (
        <div
          className="flex-shrink-0 mt-1 size-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: ACCENT_DIM }}
        >
          <span className="text-sm font-bold" style={{ color: ACCENT }}>Y</span>
        </div>
      )}
    </motion.div>
  );
}
