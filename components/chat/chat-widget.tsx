"use client";

import { useState } from "react";
import { ChatFab } from "@/components/chat/chat-fab";
import { ChatPanel } from "@/components/chat/chat-panel";

export function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ChatPanel open={open} onClose={() => setOpen(false)} />
      <ChatFab open={open} onToggle={() => setOpen((value) => !value)} />
    </>
  );
}
