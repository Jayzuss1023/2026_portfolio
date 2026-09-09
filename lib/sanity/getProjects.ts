import { sanityFetch } from "@/sanity/lib/live";
import { PROJECTS_QUERY } from "@/sanity/lib/queries";

export async function getProjects() {
  const { data } = await sanityFetch({ query: PROJECTS_QUERY });
  return data ?? [];
}

export type ProjectListItem = Awaited<ReturnType<typeof getProjects>>[number];
