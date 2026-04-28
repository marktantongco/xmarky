'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Plus, X, RotateCcw, StopCircle, Keyboard, Trash2, ArrowDown } from 'lucide-react';
import { Message, ACCENT, ACCENT_DIM, MODEL_INFO, STORAGE_KEY } from '@/lib/chat';
import { XmarkyLogo } from '@/components/chat/xmarky-logo';
import { TypingIndicator } from '@/components/chat/typing-indicator';
import { MessageBubble } from '@/components/chat/message-bubble';
import { SuggestionCards } from '@/components/chat/suggestion-cards';
import { Sidebar, TabId } from '@/components/sidebar';
import { SkillsTab } from '@/components/tabs/skills-tab';
import { WorkflowsTab } from '@/components/tabs/workflows-tab';
import { MCPTab } from '@/components/tabs/mcp-tab';

// ─── localStorage helpers ─────────────────────────────────────────
function loadMessages(): Message[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((m: Message) => ({
      ...m,
      timestamp: new Date(m.timestamp),
    }));
  } catch {
    return [];
  }
}

function saveMessages(messages: Message[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // localStorage full or unavailable
  }
}

// ─── Main App Component ──────────────────────────────────────────────
export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('chat');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [mounted, setMounted] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadMessages();
    if (saved.length > 0) setMessages(saved);
    setMounted(true);
  }, []);

  // Persist to localStorage on message change
  useEffect(() => {
    if (mounted && messages.length > 0 && !isLoading) {
      saveMessages(messages);
    }
  }, [messages, mounted, isLoading]);

  // Auto-scroll chat
  const scrollToBottom = useCallback((smooth = true) => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: smooth ? 'smooth' : 'instant',
        });
      }
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // Handle scroll position
  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        const isNearBottom =
          viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight < 120;
        setShowScrollBtn(!isNearBottom);
      }
    }
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  // Focus textarea on Ctrl+/
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setActiveTab('chat');
        setTimeout(() => textareaRef.current?.focus(), 100);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Send message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      setError(null);
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInput('');
      setIsLoading(true);

      const assistantId = crypto.randomUUID();
      const withAssistant: Message[] = [
        ...updatedMessages,
        { id: assistantId, role: 'assistant', content: '', timestamp: new Date() },
      ];
      setMessages(withAssistant);

      abortControllerRef.current = new AbortController();

      try {
        const allMessages = updatedMessages.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: allMessages,
            systemPrompt: `You are xmarky, an AI agent powered by LongCat-2.0-Preview. You are helpful, knowledgeable, and direct. You have access to skills and workflows that help you accomplish complex tasks. When users ask about skills, MCP servers, or workflows, guide them to the appropriate tab in the interface. Model: ${MODEL_INFO.name}, Context: ${MODEL_INFO.contextWindow}, Max Output: ${MODEL_INFO.maxOutput}.`,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response stream');

        const decoder = new TextDecoder();
        let accumulatedContent = '';
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const data = line.slice(6).trim();
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);

              if (parsed.type === 'delta' && parsed.content) {
                accumulatedContent += parsed.content;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: accumulatedContent }
                      : m
                  )
                );
              }
            } catch {
              // skip malformed JSON
            }
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId && !m.content
                ? { ...m, content: '*Generation stopped by user.*' }
                : m
            )
          );
        } else {
          const errorMsg = err instanceof Error ? err.message : 'Something went wrong';
          setError(errorMsg);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId && !m.content
                ? { ...m, content: `Error: ${errorMsg}` }
                : m
            )
          );
        }
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [messages, isLoading]
  );

  const stopGeneration = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const handleNewChat = useCallback(() => {
    abortControllerRef.current?.abort();
    setMessages([]);
    setInput('');
    setError(null);
    setIsLoading(false);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const handleClearHistory = useCallback(() => {
    handleNewChat();
  }, [handleNewChat]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(input);
      }
    },
    [input, sendMessage]
  );

  const handleSuggestionClick = useCallback(
    (title: string) => {
      sendMessage(title);
    },
    [sendMessage]
  );

  const hasMessages = messages.length > 0;
  const messageCount = messages.filter((m) => m.role === 'user').length;

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex min-h-screen bg-[#0a0a1a] text-white">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main content area */}
        <main className="flex-1 flex flex-col min-h-screen md:min-h-0">
          {activeTab === 'chat' ? (
            <>
              {/* ─── Chat Header ──────────────────────────────────────── */}
              <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0a0a1a]/80 backdrop-blur-xl">
                <div className="max-w-3xl mx-auto flex items-center justify-between px-4 h-14">
                  <div className="flex items-center gap-3">
                    <div className="md:hidden">
                      <XmarkyLogo size={28} />
                    </div>
                    <div>
                      <h1 className="text-base font-bold tracking-tight text-white leading-none">
                        xmarky
                      </h1>
                      <p className="text-[10px] leading-none mt-0.5" style={{ color: ACCENT }}>
                        LongCat-2.0-Preview &mdash; 1M Context
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {hasMessages && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearHistory}
                            className="text-gray-500 hover:text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="size-4" />
                            <span className="hidden sm:inline text-xs">Clear</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>Clear conversation history</p>
                        </TooltipContent>
                      </Tooltip>
                    )}

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleNewChat}
                          className="text-gray-400 hover:bg-white/5 gap-1.5"
                        >
                          <Plus className="size-4" />
                          <span className="hidden sm:inline text-xs">New Chat</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Start a new conversation</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Clears current chat</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-gray-600 hover:text-gray-400 transition-colors cursor-default p-1">
                          <Keyboard className="size-4" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-xs">
                        <div className="space-y-1">
                          <p className="font-medium text-xs">Keyboard Shortcuts</p>
                          <div className="flex justify-between gap-4 text-[10px]">
                            <span className="text-gray-400">Send message</span>
                            <kbd className="px-1 py-0.5 bg-white/10 rounded text-[10px]">Enter</kbd>
                          </div>
                          <div className="flex justify-between gap-4 text-[10px]">
                            <span className="text-gray-400">New line</span>
                            <kbd className="px-1 py-0.5 bg-white/10 rounded text-[10px]">Shift+Enter</kbd>
                          </div>
                          <div className="flex justify-between gap-4 text-[10px]">
                            <span className="text-gray-400">Focus input</span>
                            <kbd className="px-1 py-0.5 bg-white/10 rounded text-[10px]">Ctrl+/</kbd>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </header>

              {/* ─── Chat Content ──────────────────────────────────────── */}
              <div className="flex-1 relative overflow-hidden">
                {!hasMessages ? (
                  <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-4">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="text-center"
                    >
                      <div className="mb-6 flex justify-center">
                        <div className="relative">
                          <div
                            className="absolute inset-0 rounded-full blur-3xl scale-150"
                            style={{ backgroundColor: `${ACCENT}33` }}
                          />
                          <XmarkyLogo size={80} />
                        </div>
                      </div>

                      <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="text-3xl sm:text-4xl font-bold text-white mb-2"
                      >
                        Hello! I&apos;m{' '}
                        <span style={{ color: ACCENT }}>xmarky</span>
                      </motion.h2>

                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="text-gray-400 text-sm sm:text-base mb-10 max-w-md mx-auto"
                      >
                        Your AI agent powered by {MODEL_INFO.name}. {MODEL_INFO.description}.
                        Explore Skills, Workflows, and MCP Servers from the sidebar.
                      </motion.p>

                      <SuggestionCards onSuggestionClick={handleSuggestionClick} />

                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-[11px] text-gray-600 mt-6"
                      >
                        Press <kbd className="px-1 py-0.5 bg-white/10 rounded text-[10px]">Ctrl+/</kbd> to focus the input anytime
                      </motion.p>
                    </motion.div>
                  </div>
                ) : (
                  <div className="relative h-[calc(100vh-8rem)]" ref={scrollRef}>
                    <ScrollArea className="h-full" onScrollCapture={handleScroll}>
                      <div className="max-w-3xl mx-auto py-6 space-y-6">
                        {messages.map((message) => (
                          <MessageBubble key={message.id} message={message} />
                        ))}

                        <AnimatePresence>
                          {isLoading &&
                            messages[messages.length - 1]?.content === '' && (
                              <TypingIndicator />
                            )}
                        </AnimatePresence>

                        {error && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-center px-4"
                          >
                            <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 rounded-full px-4 py-2">
                              <X className="size-3.5" />
                              {error}
                            </div>
                          </motion.div>
                        )}

                        <div className="h-4" />
                      </div>
                    </ScrollArea>

                    <AnimatePresence>
                      {showScrollBtn && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute bottom-4 left-1/2 -translate-x-1/2"
                        >
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => scrollToBottom()}
                                className="rounded-full bg-[#1e1e32] border-white/10 shadow-lg text-gray-400 hover:text-white hover:bg-[#2a2a42]"
                              >
                                <ArrowDown className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                              <p>Scroll to latest message</p>
                            </TooltipContent>
                          </Tooltip>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* ─── Chat Input ──────────────────────────────────────── */}
              <div className="sticky bottom-0 border-t border-white/5 bg-[#0a0a1a]/90 backdrop-blur-xl md:pb-0 pb-16">
                <div className="max-w-3xl mx-auto px-4 py-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="relative flex items-end gap-2 bg-[#12122a] rounded-2xl border border-white/5 transition-colors p-2 focus-within:border-violet-500/20"
                      >
                        <textarea
                          ref={textareaRef}
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Message xmarky..."
                          rows={1}
                          disabled={isLoading}
                          className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 resize-none outline-none px-3 py-2 min-h-[36px] max-h-[160px] disabled:opacity-50"
                        />

                        {isLoading ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={stopGeneration}
                                className="flex-shrink-0 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 h-9 w-9"
                              >
                                <StopCircle className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p>Stop generating</p>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => sendMessage(input)}
                                disabled={!input.trim()}
                                className="flex-shrink-0 rounded-xl h-9 w-9 text-white disabled:opacity-30"
                                style={{ backgroundColor: ACCENT }}
                              >
                                <Send className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p>Send message</p>
                              <p className="text-[10px] text-gray-400 mt-0.5">or press Enter</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="hidden sm:block">
                      <p>Shift+Enter for a new line</p>
                    </TooltipContent>
                  </Tooltip>

                  <p className="text-[10px] text-gray-600 text-center mt-2">
                    xmarky uses {MODEL_INFO.name} ({MODEL_INFO.contextWindow})
                    {messageCount > 0 && ` · ${messageCount} message${messageCount > 1 ? 's' : ''}`}
                    {' · '}Conversations saved locally
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* ─── Tab Content Header ──────────────────────────────── */}
              <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0a0a1a]/80 backdrop-blur-xl md:pb-0 pb-16">
                <div className="max-w-5xl mx-auto px-6 h-14 flex items-center">
                  {activeTab === 'skills' && (
                    <div className="flex items-center gap-2">
                      <span style={{ color: ACCENT }} className="text-lg font-bold">Puzzle</span>
                      <span className="text-sm font-medium text-gray-400">/ Skills Library</span>
                    </div>
                  )}
                  {activeTab === 'workflows' && (
                    <div className="flex items-center gap-2">
                      <span style={{ color: ACCENT }} className="text-lg font-bold">GitBranch</span>
                      <span className="text-sm font-medium text-gray-400">/ Workflows</span>
                    </div>
                  )}
                  {activeTab === 'mcp' && (
                    <div className="flex items-center gap-2">
                      <span style={{ color: ACCENT }} className="text-lg font-bold">Server</span>
                      <span className="text-sm font-medium text-gray-400">/ MCP Servers</span>
                    </div>
                  )}
                </div>
              </header>

              {/* ─── Tab Content ──────────────────────────────────────── */}
              <div className="flex-1 overflow-y-auto md:pb-0 pb-16">
                <div className="max-w-5xl mx-auto px-6 py-6">
                  <AnimatePresence mode="wait">
                    {activeTab === 'skills' && (
                      <motion.div
                        key="skills"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <SkillsTab />
                      </motion.div>
                    )}
                    {activeTab === 'workflows' && (
                      <motion.div
                        key="workflows"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <WorkflowsTab />
                      </motion.div>
                    )}
                    {activeTab === 'mcp' && (
                      <motion.div
                        key="mcp"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <MCPTab />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </TooltipProvider>
  );
}
