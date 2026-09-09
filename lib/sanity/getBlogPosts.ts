import { sanityFetch } from "@/sanity/lib/live";
import { BLOG_POSTS_QUERY } from "@/sanity/lib/queries";

export async function getBlogPosts() {
  const { data } = await sanityFetch({ query: BLOG_POSTS_QUERY });
  return data ?? [];
}

export type BlogPostListItem = Awaited<ReturnType<typeof getBlogPosts>>[number];
