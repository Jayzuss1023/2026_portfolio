import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableTextBody } from "@/components/portable-text";
import { getBlogPostBySlug } from "@/lib/sanity/getBlogPostBySlug";
import { sanityFetch } from "@/sanity/lib/live";
import { BLOG_SLUGS_QUERY } from "@/sanity/lib/queries";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: BLOG_SLUGS_QUERY,
    perspective: "published",
    stega: false,
  });

  return (data ?? [])
    .filter((item): item is { slug: string } => typeof item.slug === "string")
    .map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug, { stega: false });

  return {
    title: post?.title ?? "Blog post",
    description: "Blog post from the portfolio",
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) notFound();

  const publishedLabel = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6">
      <Link
        href="/#blog"
        className="text-muted-foreground hover:text-primary text-sm transition-colors"
      >
        ← Back to blog
      </Link>

      <header className="flex flex-col gap-3">
        <h1 className="font-heading text-4xl font-semibold tracking-tight">
          {post.title}
        </h1>
        {publishedLabel ? (
          <p className="text-muted-foreground text-sm">{publishedLabel}</p>
        ) : null}
      </header>

      {Array.isArray(post.description) && post.description.length > 0 ? (
        <article>
          <PortableTextBody value={post.description} />
        </article>
      ) : (
        <p className="text-muted-foreground text-sm">
          This post does not have body content yet.
        </p>
      )}
    </main>
  );
}
