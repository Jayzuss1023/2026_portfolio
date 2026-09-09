"use client";

import type { UIMessage } from "ai";

type Props = {
  messages: UIMessage[];
};

export function ChatMessages({ messages }: Props) {
  if (messages.length === 0) {
    return (
      <p className="text-muted-foreground text-sm leading-6">
        Ask about skills, projects, writing, or how to get in touch. Answers come
        from this portfolio&apos;s Sanity content only.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {messages.map((message) => (
        <div
          key={message.id}
          className={
            message.role === "user"
              ? "bg-primary text-primary-foreground ml-8 rounded-2xl px-3 py-2 text-sm"
              : "bg-muted text-foreground mr-6 rounded-2xl px-3 py-2 text-sm"
          }
        >
          {message.parts.map((part, index) => {
            if (part.type !== "text") return null;
            return (
              <p
                key={`${message.id}-${index}`}
                className="whitespace-pre-wrap leading-6"
              >
                {part.text}
              </p>
            );
          })}
        </div>
      ))}
    </div>
  );
}
