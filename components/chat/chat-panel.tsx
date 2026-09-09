"use client";

import { useChat } from "@ai-sdk/react";
import { Show, SignInButton, useAuth } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ChatMessages } from "@/components/chat/chat-messages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STARTERS = [
  "What are your main skills?",
  "Tell me about a featured project",
  "How do I contact you?",
] as const;

type Props = {
  open: boolean;
  onClose: () => void;
};

export function ChatPanel({ open, onClose }: Props) {
  const { isSignedIn } = useAuth();
  const [input, setInput] = useState("");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, status, error, clearError } = useChat();

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollerRef.current?.scrollTo({
      top: scrollerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, status]);

  useEffect(() => {
    if (!error) return;
    toast.error(
      error.message.includes("401")
        ? "Please sign in to use chat."
        : "Chat failed. Please try again.",
    );
    clearError?.();
  }, [error, clearError]);

  async function submitText(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy || !isSignedIn) return;
    setInput("");
    await sendMessage({ text: trimmed });
  }

  if (!open) return null;

  return (
    <section
      id="portfolio-chat-panel"
      aria-label="Portfolio chat"
      className="border-border bg-card fixed right-4 bottom-20 z-50 flex h-[min(520px,70vh)] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border shadow-lg sm:right-6 sm:bottom-24"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <header className="border-border flex items-center justify-between border-b px-4 py-3">
        <h2 className="font-heading text-base font-semibold">Ask about my work</h2>
        <Button type="button" variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </header>

      <Show when="signed-out">
        <div className="flex flex-1 flex-col justify-center gap-4 p-4">
          <p className="text-muted-foreground text-sm leading-6">
            Sign in to chat about this portfolio. Answers use published Sanity
            content only.
          </p>
          <SignInButton mode="modal">
            <Button type="button">Sign in</Button>
          </SignInButton>
        </div>
      </Show>

      <Show when="signed-in">
        <div ref={scrollerRef} className="flex-1 overflow-y-auto p-4">
          <ChatMessages messages={messages} />
          {messages.length === 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {STARTERS.map((starter) => (
                <Button
                  key={starter}
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={busy}
                  onClick={() => void submitText(starter)}
                >
                  {starter}
                </Button>
              ))}
            </div>
          ) : null}
        </div>

        <form
          className="border-border flex gap-2 border-t p-3"
          onSubmit={(event) => {
            event.preventDefault();
            void submitText(input);
          }}
        >
          <Input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask a portfolio question…"
            disabled={busy}
            aria-label="Chat message"
          />
          <Button type="submit" disabled={busy || !input.trim()}>
            Send
          </Button>
        </form>
      </Show>
    </section>
  );
}
