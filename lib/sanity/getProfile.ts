import { sanityFetch } from "@/sanity/lib/live";
import { PROFILE_QUERY } from "@/sanity/lib/queries";

export async function getProfile() {
  const { data } = await sanityFetch({ query: PROFILE_QUERY });
  return data;
}

export type Profile = NonNullable<Awaited<ReturnType<typeof getProfile>>>;
