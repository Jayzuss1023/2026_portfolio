import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableTextBody } from "@/components/portable-text";
import { TechOverflow } from "@/components/tech-overflow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cleanStringList } from "@/lib/sanity/clean";
import { getProjectBySlug } from "@/lib/sanity/getProjectBySlug";
import { sanityFetch } from "@/sanity/lib/live";
import { urlFor } from "@/sanity/lib/image";
import { PROJECT_SLUGS_QUERY } from "@/sanity/lib/queries";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: PROJECT_SLUGS_QUERY,
    perspective: "published",
    stega: false,
  });

  return (data ?? [])
    .filter((item): item is { slug: string } => typeof item.slug === "string")
    .map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug, { stega: false });

  return {
    title: project?.title ?? "Project",
    description: project?.tagline || "Project details",
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const coverUrl = project.coverImage?.asset
    ? urlFor(project.coverImage).width(1400).height(800).fit("crop").url()
    : null;
  const technologies = cleanStringList(project.technologies);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6">
      <Link
        href="/#projects"
        className="text-muted-foreground hover:text-primary text-sm transition-colors"
      >
        ← Back to projects
      </Link>

      {coverUrl ? (
        <div className="bg-muted relative aspect-[16/9] overflow-hidden rounded-2xl">
          <Image
            src={coverUrl}
            alt={project.coverImage?.alt || project.title || "Project cover"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      ) : null}

      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {project.category ? (
            <Badge variant="outline">{project.category}</Badge>
          ) : null}
        </div>
        <h1 className="font-heading text-4xl font-semibold tracking-tight">
          {project.title}
        </h1>
        <p className="text-muted-foreground text-lg leading-8">
          {project.tagline}
        </p>
        <TechOverflow technologies={technologies} />
      </header>

      <section className="flex flex-wrap gap-2">
        {project.liveUrl ? (
          <Button
            nativeButton={false}
            render={
              <a href={project.liveUrl} target="_blank" rel="noreferrer" />
            }
          >
            Live site
          </Button>
        ) : null}
        {project.githubUrl ? (
          <Button
            variant="outline"
            nativeButton={false}
            render={
              <a href={project.githubUrl} target="_blank" rel="noreferrer" />
            }
          >
            Repository
          </Button>
        ) : null}
      </section>

      {Array.isArray(project.body) && project.body.length > 0 ? (
        <article>
          <PortableTextBody value={project.body} />
        </article>
      ) : (
        <p className="text-muted-foreground text-sm">
          Add rich text content to the body field in Sanity to render project
          details here.
        </p>
      )}
    </main>
  );
}
