import { auth } from "@clerk/nextjs/server";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { getChatSnapshot } from "@/lib/chat/getChatSnapshot";
import { buildSystemPrompt } from "@/lib/chat/system-prompt";
import { createChatTools } from "@/lib/chat/tools";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return Response.json(
      { error: "Chat is not configured" },
      { status: 500 },
    );
  }

  let messages: UIMessage[];
  try {
    const body = (await req.json()) as { messages?: UIMessage[] };
    if (!Array.isArray(body.messages)) {
      return Response.json({ error: "Invalid body" }, { status: 400 });
    }
    messages = body.messages;
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
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
