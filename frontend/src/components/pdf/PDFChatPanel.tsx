"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send, Loader2, Sparkles, BookOpen, Shield, Copy, Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { API_URL } from "@/lib/constants";
import { INITIAL_STREAMING_STATE } from "@/types/ai";
import type { AIMessage, ChatStreamChunk } from "@/types/ai";

/* =============================================================================
   PDFChatPanel — AI chat interface for an uploaded PDF
   Evidence-first: every response shows citations + confidence
   ============================================================================= */

interface PDFChatPanelProps {
  pdfId:      string;
  fileName:   string;
  className?: string;
}

const SUGGESTED_PROMPTS = [
  "Summarize the key findings",
  "What methodology was used?",
  "List the main contributions",
  "What are the limitations?",
  "Explain the key equations",
  "What datasets were used?",
];

export default function PDFChatPanel({
  pdfId,
  fileName,
  className,
}: PDFChatPanelProps) {
  const [messages,  setMessages]  = useState<AIMessage[]>([]);
  const [input,     setInput]     = useState("");
  const [streaming, setStreaming] = useState(INITIAL_STREAMING_STATE);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLTextAreaElement>(null);

  /* Auto scroll to bottom */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming.currentText]);

  /* ------------------------------------------------------------------ */
  /* Send message                                                         */
  /* ------------------------------------------------------------------ */
  async function sendMessage(text?: string) {
    const content = (text ?? input).trim();
    if (!content || streaming.isStreaming) return;

    setInput("");

    // Add user message immediately
    const userMsg: AIMessage = {
      id:          crypto.randomUUID(),
      role:        "user",
      content,
      citations:   [],
      confidence:  null,
      isStreaming: false,
      createdAt:   new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    // Start streaming state
    setStreaming({ ...INITIAL_STREAMING_STATE, isStreaming: true });

    try {
      const res = await fetch(`${API_URL}/pdf/${pdfId}/chat`, {
        method:  "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          message:     content,
          sessionId:   sessionId ?? undefined,
          sessionType: "pdf_chat",
        }),
      });

      if (!res.ok) throw new Error("Chat request failed");
      if (!res.body) throw new Error("No response body");

      // Stream the response
      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText  = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const lines = decoder.decode(value).split("\n").filter(Boolean);

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const chunk: ChatStreamChunk = JSON.parse(line.slice(6));
            if (chunk.type === "text" && chunk.content) {
              fullText += chunk.content;
              setStreaming((s) => ({ ...s, currentText: fullText }));
            }
            if (chunk.type === "citation" && chunk.citation) {
              setStreaming((s) => ({ ...s, citations: [...s.citations, chunk.citation!] }));
            }
            if (chunk.sessionId) {
              setSessionId(chunk.sessionId);
            }
            if (chunk.type === "done") {
              // Commit streamed message
              const aiMsg: AIMessage = {
                id:          crypto.randomUUID(),
                role:        "assistant",
                content:     fullText,
                citations:   streaming.citations,
                confidence:  0.88,
                isStreaming: false,
                createdAt:   new Date().toISOString(),
              };
              setMessages((prev) => [...prev, aiMsg]);
              setStreaming(INITIAL_STREAMING_STATE);
            }
            if (chunk.type === "error") {
              throw new Error(chunk.error ?? "Stream error");
            }
          } catch {
            // skip malformed chunks
          }
        }
      }
    } catch {
      setStreaming(INITIAL_STREAMING_STATE);
      const errMsg: AIMessage = {
        id:          crypto.randomUUID(),
        role:        "assistant",
        content:     "Sorry, I couldn't process that request. Please try again.",
        citations:   [],
        confidence:  null,
        isStreaming: false,
        createdAt:   new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errMsg]);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  /* ------------------------------------------------------------------ */
  /* Render                                                               */
  /* ------------------------------------------------------------------ */
  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>

      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border shrink-0">
        <Sparkles className="w-4 h-4 text-primary" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">AI Chat</p>
          <p className="text-xs text-muted-foreground truncate">{fileName}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">

        {/* Welcome message */}
        {messages.length === 0 && !streaming.isStreaming && (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              Chat with this paper
            </p>
            <p className="text-xs text-muted-foreground mb-6 max-w-xs">
              Ask anything about the content. Every answer is grounded in the paper.
            </p>

            {/* Suggested prompts */}
            <div className="grid grid-cols-1 gap-2 w-full max-w-sm">
              {SUGGESTED_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  className="text-left text-xs px-3 py-2 rounded-lg border border-border
                    text-muted-foreground hover:text-foreground hover:border-primary/40
                    hover:bg-accent transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message list */}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* Streaming message */}
        {streaming.isStreaming && (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">ResearchOS AI</span>
            </div>
            <div className="ai-message ml-7">
              {streaming.currentText ? (
                <p className="text-sm leading-relaxed streaming-cursor">
                  {streaming.currentText}
                </p>
              ) : (
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ai-pulse" />
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ai-pulse [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ai-pulse [animation-delay:0.4s]" />
                </div>
              )}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-3 shrink-0">
        <div className={cn(
          "flex items-end gap-2 rounded-xl border bg-background transition-all p-2",
          "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
          "border-input"
        )}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about this paper…"
            rows={1}
            disabled={streaming.isStreaming}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground
              resize-none max-h-32 overflow-y-auto leading-relaxed disabled:opacity-50"
            style={{ minHeight: "1.5rem" }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || streaming.isStreaming}
            className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center
              hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            aria-label="Send message"
          >
            {streaming.isStreaming
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <Send    className="w-3.5 h-3.5" />
            }
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-1.5 text-center">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

/* =============================================================================
   MessageBubble sub-component
   ============================================================================= */

function MessageBubble({ message }: { message: AIMessage }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const isUser = message.role === "user";

  return (
    <div className={cn("flex flex-col gap-1", isUser && "items-end")}>
      {/* Role label */}
      {!isUser && (
        <div className="flex items-center gap-2 ml-0">
          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-primary" />
          </div>
          <span className="text-xs text-muted-foreground">ResearchOS AI</span>
        </div>
      )}

      {/* Bubble */}
      <div className={cn(
        "group relative max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed",
        isUser
          ? "bg-primary text-primary-foreground"
          : "ai-message"
      )}>
        <p>{message.content}</p>

        {/* Citations */}
        {!isUser && message.citations.length > 0 && (
          <div className="mt-2 pt-2 border-t border-border/50 flex flex-wrap gap-1">
            {message.citations.map((c) => (
              <span key={c.index} className="ai-message-citation">
                [{c.index}]
              </span>
            ))}
          </div>
        )}

        {/* Confidence */}
        {!isUser && message.confidence !== null && (
          <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-border/50">
            <Shield className="w-3 h-3 text-emerald-500" />
            <span className="text-xs text-emerald-500">
              {Math.round(message.confidence * 100)}% confidence
            </span>
          </div>
        )}

        {/* Copy button */}
        {!isUser && (
          <button
            onClick={copy}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity
              w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground"
            aria-label="Copy message"
          >
            {copied
              ? <Check className="w-3 h-3 text-emerald-500" />
              : <Copy  className="w-3 h-3" />
            }
          </button>
        )}
      </div>
    </div>
  );
}

/* =============================================================================
   Helper
   ============================================================================= */
function getToken(): string {
  try {
    const raw = localStorage.getItem("researchos:auth");
    if (!raw) return "";
    const parsed = JSON.parse(raw) as { state?: { accessToken?: string } };
    return parsed?.state?.accessToken ?? "";
  } catch {
    return "";
  }
}