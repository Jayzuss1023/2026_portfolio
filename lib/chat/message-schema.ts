import { z } from "zod";

const textPartSchema = z
  .object({
    type: z.literal("text"),
    text: z.string(),
  })
  .passthrough();

/** Non-text parts (tools, etc.) kept loose so multi-turn history still works. */
const otherPartSchema = z
  .object({
    type: z.string().min(1),
  })
  .passthrough();

const chatUIMessageSchema = z
  .object({
    id: z.string().min(1),
    role: z.enum(["user", "assistant", "system"]),
    parts: z.array(z.union([textPartSchema, otherPartSchema])),
  })
  .passthrough();

export const chatRequestBodySchema = z.object({
  messages: z.array(chatUIMessageSchema),
});

export type ChatUIMessage = z.infer<typeof chatUIMessageSchema>;

export function totalMessageTextChars(messages: ChatUIMessage[]): number {
  let total = 0;
  for (const message of messages) {
    for (const part of message.parts) {
      if (part.type === "text" && typeof part.text === "string") {
        total += part.text.length;
      }
    }
  }
  return total;
}

export const MAX_CHAT_MESSAGES = 40;
export const MAX_CHAT_TEXT_CHARS = 20_000;
