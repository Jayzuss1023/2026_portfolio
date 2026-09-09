import { sanityFetch } from "@/sanity/lib/live";
import { NAVIGATION_QUERY } from "@/sanity/lib/queries";

export async function getNavigation() {
  const { data } = await sanityFetch({ query: NAVIGATION_QUERY });
  if (!data?.links) return data;

  return {
    ...data,
    links: [...data.links].sort(
      (a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER),
    ),
  };
}

export type Navigation = NonNullable<Awaited<ReturnType<typeof getNavigation>>>;
export type NavLink = NonNullable<Navigation["links"]>[number];
