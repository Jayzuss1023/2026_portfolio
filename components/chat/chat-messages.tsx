"use client";

import type { UIMessage } from "ai";
import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  messages: UIMessage[];
};

/** Markdown `[label](/path)` plus bare `/projects…`, `/blog…`, `#contact`. */
const LINK_RE =
  /\[([^\]]+)\]\((\/[^)\s]+|#[^)\s]+)\)|(\/(?:projects|blog)(?:\/[\w-]+)?|#contact)/g;

function LinkedText({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  const re = new RegExp(LINK_RE.source, "g");
  let match = re.exec(text);

  while (match !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const label = match[1];
    const mdHref = match[2];
    const bare = match[3];
    const href = mdHref ?? bare ?? "";
    const content = label ?? bare ?? href;

    nodes.push(
      <Link
        key={`${match.index}-${href}`}
        href={href}
        className="underline underline-offset-2"
      >
        {content}
      </Link>,
    );

    lastIndex = match.index + match[0].length;
    match = re.exec(text);
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return <>{nodes.length > 0 ? nodes : text}</>;
}

export function ChatMessages({ messages }: Props) {
  if (messages.length === 0) {
    return (
      <p className="text-muted-foreground text-sm leading-6">
        Ask about skills, projects, writing, or how to get in touch. Answers
        come from this portfolio&apos;s Sanity content only.
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
                <LinkedText text={part.text} />
              </p>
            );
          })}
        </div>
      ))}
    </div>
  );
}
