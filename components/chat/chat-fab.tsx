"use client";

import { IconMessage, IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onToggle: () => void;
};

export function ChatFab({ open, onToggle }: Props) {
  return (
    <Button
      type="button"
      size="icon-lg"
      aria-expanded={open}
      aria-controls="portfolio-chat-panel"
      aria-label={open ? "Close chat" : "Open chat"}
      onClick={onToggle}
      className="fixed right-4 bottom-4 z-50 size-12 rounded-full shadow-md sm:right-6 sm:bottom-6"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      {open ? <IconX className="size-5" /> : <IconMessage className="size-5" />}
    </Button>
  );
}
