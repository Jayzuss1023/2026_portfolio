import { sanityFetch } from "@/sanity/lib/live";
import { BLOG_POST_QUERY } from "@/sanity/lib/queries";

export async function getBlogPostBySlug(
  slug: string,
  options?: { stega?: boolean },
) {
  const { data } = await sanityFetch({
    query: BLOG_POST_QUERY,
    params: { slug },
    stega: options?.stega,
  });
  return data;
}

export type BlogPostDetail = NonNullable<
  Awaited<ReturnType<typeof getBlogPostBySlug>>
>;
