import { sanityFetch } from "@/sanity/lib/live";
import { PROJECT_QUERY } from "@/sanity/lib/queries";

export async function getProjectBySlug(
  slug: string,
  options?: { stega?: boolean },
) {
  const { data } = await sanityFetch({
    query: PROJECT_QUERY,
    params: { slug },
    stega: options?.stega,
  });
  return data;
}

export type ProjectDetail = NonNullable<
  Awaited<ReturnType<typeof getProjectBySlug>>
>;
