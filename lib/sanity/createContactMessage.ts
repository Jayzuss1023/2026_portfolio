import { createClient } from "next-sanity";
import type { ContactInput } from "@/lib/validations/contact";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export async function createContactMessage(input: ContactInput) {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) {
    throw new Error("Missing environment variable: SANITY_API_WRITE_TOKEN");
  }

  const writeClient = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });

  const doc = await writeClient.create({
    _type: "contactMessage",
    name: input.name,
    email: input.email,
    subject: input.subject,
    message: input.message,
    submittedAt: new Date().toISOString(),
  });

  return { id: doc._id };
}
