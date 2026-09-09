import Image from "next/image";
import Link from "next/link";
import { TechOverflow } from "@/components/tech-overflow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ProjectListItem } from "@/lib/sanity/getProjects";
import { cleanStringList } from "@/lib/sanity/clean";
import { urlFor } from "@/sanity/lib/image";

type Props = {
  projects: ProjectListItem[];
};

export function ProjectsSection({ projects }: Props) {
  return (
    <section id="projects" className="border-border/60 border-b">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-16 sm:px-6">
        <div className="flex flex-col gap-2">
          <p className="text-accent text-sm font-semibold tracking-[0.18em] uppercase">
            Projects
          </p>
          <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Selected work
          </h2>
          <p className="text-muted-foreground max-w-2xl text-base leading-7">
            Applications and experiments built with modern web stacks, APIs, and
            AI tooling.
          </p>
        </div>

        {projects.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Projects will appear here once published in Sanity.
          </p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {projects.map((project) => {
              if (!project.slug) return null;
              const slug = project.slug;
              const coverUrl = project.coverImage?.asset
                ? urlFor(project.coverImage)
                    .width(900)
                    .height(560)
                    .fit("crop")
                    .url()
                : null;
              const technologies = cleanStringList(project.technologies);

              return (
                <Card key={project._id} className="overflow-hidden pt-0">
                  {coverUrl ? (
                    <div className="bg-muted relative aspect-[16/10] w-full">
                      <Image
                        src={coverUrl}
                        alt={project.coverImage?.alt || project.title || "Project"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  ) : null}
                  <CardHeader>
                    <div className="flex flex-wrap items-center gap-2">
                      {project.category ? (
                        <Badge variant="outline">{project.category}</Badge>
                      ) : null}
                      {project.featured ? (
                        <Badge>Featured</Badge>
                      ) : null}
                    </div>
                    <CardTitle className="font-heading text-2xl">
                      <Link
                        href={`/projects/${slug}`}
                        className="hover:text-primary transition-colors"
                      >
                        {project.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-base leading-7">
                      {project.tagline}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TechOverflow technologies={technologies} />
                  </CardContent>
                  <CardFooter className="gap-2">
                    <Button
                      size="sm"
                      nativeButton={false}
                      render={<Link href={`/projects/${slug}`} />}
                    >
                      Details
                    </Button>
                    {project.liveUrl ? (
                      <Button
                        size="sm"
                        variant="outline"
                        nativeButton={false}
                        render={
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                          />
                        }
                      >
                        Live
                      </Button>
                    ) : null}
                    {project.githubUrl ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        nativeButton={false}
                        render={
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                          />
                        }
                      >
                        GitHub
                      </Button>
                    ) : null}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
