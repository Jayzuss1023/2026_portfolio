import { createContactMessage } from "@/lib/sanity/createContactMessage";
import { contactSchema } from "@/lib/validations/contact";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const { id } = await createContactMessage(parsed.data);
    return Response.json({ ok: true, id });
  } catch (error) {
    console.error("createContactMessage failed", error);
    return Response.json(
      { error: "Unable to save contact message" },
      { status: 500 },
    );
  }
}
