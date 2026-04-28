'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { ACCENT } from '@/lib/chat';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export function CodeBlock({
  language,
  children,
}: {
  language: string;
  children: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-lg overflow-hidden my-3">
      <div className="flex items-center justify-between bg-[#282a36] px-4 py-2 text-xs text-gray-400">
        <span>{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 hover:text-violet-400 transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="size-3.5" style={{ color: ACCENT }} />
              <span style={{ color: ACCENT }}>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="size-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || 'text'}
        style={oneDark}
        customStyle={{ margin: 0, borderRadius: 0, fontSize: '0.85rem', background: '#282a36' }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}
