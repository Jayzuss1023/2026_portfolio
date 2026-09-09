import Link from "next/link";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { BlogPostListItem } from "@/lib/sanity/getBlogPosts";

type Props = {
  posts: BlogPostListItem[];
};

function excerptFromBlocks(
  description: BlogPostListItem["description"],
): string {
  if (!Array.isArray(description)) return "Read this post";
  const text = description
    .flatMap((block) =>
      block._type === "block" && Array.isArray(block.children)
        ? block.children.map((child) => child.text ?? "")
        : [],
    )
    .join(" ")
    .trim();
  if (!text) return "Read this post";
  return text.length > 140 ? `${text.slice(0, 140)}…` : text;
}

export function BlogSection({ posts }: Props) {
  return (
    <section id="blog" className="border-border/60 border-b">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-16 sm:px-6">
        <div className="flex flex-col gap-2">
          <p className="text-accent text-sm font-semibold tracking-[0.18em] uppercase">
            Blog
          </p>
          <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Writing
          </h2>
        </div>

        {posts.length === 0 ? (
          <Empty className="border-border border border-dashed">
            <EmptyHeader>
              <EmptyTitle>No blogs are posted yet</EmptyTitle>
              <EmptyDescription>
                New articles will show up here as soon as they are published in
                Sanity Studio.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {posts.map((post) => {
              if (!post.slug) return null;
              return (
                <Link key={post._id} href={`/blog/${post.slug}`}>
                  <Card className="hover:border-primary/40 h-full transition-colors">
                    <CardHeader>
                      <CardTitle className="font-heading text-xl">
                        {post.title}
                      </CardTitle>
                      <CardDescription>
                        {excerptFromBlocks(post.description)}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
