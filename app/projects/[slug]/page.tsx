import { PortableText } from "@portabletext/react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/live";
import { PROJECT_QUERY, PROJECT_SLUGS_QUERY } from "@/sanity/lib/queries";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: PROJECT_SLUGS_QUERY,
    perspective: "published",
    stega: false,
  });

  return data;
}

export async function generateMetadata({ params }: Props) {
  const { data } = await sanityFetch({
    query: PROJECT_QUERY,
    params: await params,
    stega: false,
  });

  return {
    title: data?.title
      ? `${data.title} | 2026 Portfolio`
      : "Project | 2026 Portfolio",
    description: data?.tagline || "Project details",
  };
}

export default async function ProjectPage({ params }: Props) {
  const { data: project } = await sanityFetch({
    query: PROJECT_QUERY,
    params: await params,
  });

  if (!project) notFound();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10">
      <Link href="/" className="text-sm text-zinc-500 hover:underline">
        ← Back to projects
      </Link>

      <header className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">
          {project.title}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">{project.tagline}</p>
        {Array.isArray(project.technologies) &&
        project.technologies.length > 0 ? (
          <p className="text-sm text-zinc-500">
            {project.technologies.filter(Boolean).join(" · ")}
          </p>
        ) : null}
      </header>

      <section className="flex flex-wrap gap-3">
        {project.githubUrl ? (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Repository
          </a>
        ) : null}
        {project.liveUrl ? (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Live site
          </a>
        ) : null}
      </section>

      {Array.isArray(project.body) && project.body.length > 0 ? (
        <article className="prose prose-zinc max-w-none dark:prose-invert">
          <PortableText value={project.body} />
        </article>
      ) : (
        <p className="text-sm text-zinc-500">
          Add rich text content to the <code>body</code> field in Sanity to
          render project details here.
        </p>
      )}
    </main>
  );
}
