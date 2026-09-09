import { openai } from "@ai-sdk/openai";
import { auth } from "@clerk/nextjs/server";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { getChatSnapshot } from "@/lib/chat/getChatSnapshot";
import {
  chatRequestBodySchema,
  MAX_CHAT_MESSAGES,
  MAX_CHAT_TEXT_CHARS,
  totalMessageTextChars,
} from "@/lib/chat/message-schema";
import { checkChatRateLimit } from "@/lib/chat/rate-limit";
import { buildSystemPrompt } from "@/lib/chat/system-prompt";
import { createChatTools } from "@/lib/chat/tools";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!checkChatRateLimit(userId)) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: "Chat is not configured" }, { status: 500 });
  }

  let messages: UIMessage[];
  try {
    const json: unknown = await req.json();
    const parsed = chatRequestBodySchema.safeParse(json);
    if (!parsed.success) {
      return Response.json({ error: "Invalid body" }, { status: 400 });
    }

    const { messages: rawMessages } = parsed.data;
    if (
      rawMessages.length > MAX_CHAT_MESSAGES ||
      totalMessageTextChars(rawMessages) > MAX_CHAT_TEXT_CHARS
    ) {
      return Response.json({ error: "Payload too large" }, { status: 413 });
    }

    messages = rawMessages as UIMessage[];
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const snapshot = await getChatSnapshot();
  const modelId = process.env.OPENAI_CHAT_MODEL ?? "gpt-4.1-mini";

  const result = streamText({
    model: openai(modelId),
    system: buildSystemPrompt(snapshot),
    messages: await convertToModelMessages(messages),
    tools: createChatTools(),
    stopWhen: isStepCount(5),
    maxOutputTokens: 1200,
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      onError: (error) => {
        console.error("[api/chat]", error);
        return "Something went wrong. Please try again.";
      },
    }),
  });
}
