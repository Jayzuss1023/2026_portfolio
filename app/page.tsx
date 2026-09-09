import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { PROJECTS_QUERY } from "@/sanity/lib/queries";

export default async function Home() {
  const { data: projects } = await sanityFetch({
    query: PROJECTS_QUERY,
  });

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-10">
      <section className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
          Portfolio
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">Projects</h1>
        <p className="max-w-2xl text-zinc-600 dark:text-zinc-400">
          This page reads project content from Sanity. Add or update documents
          in the Studio and they will appear here.
        </p>
      </section>

      {projects.length === 0 ? (
        <section className="rounded-xl border border-dashed border-zinc-300 p-6 dark:border-zinc-700">
          <h2 className="text-lg font-medium">No projects published yet</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Open the Studio at <code>studio/</code>, create a{" "}
            <code>project</code> document, and publish it.
          </p>
        </section>
      ) : (
        <ul className="grid gap-4">
          {projects.map((project) => (
            <li
              key={project._id}
              className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="hover:underline"
                    >
                      {project.title}
                    </Link>
                  </h2>
                  <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                    {project.tagline}
                  </p>
                </div>
                {project.featured ? (
                  <span className="rounded-full bg-zinc-900 px-2.5 py-1 text-xs font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
                    Featured
                  </span>
                ) : null}
              </div>
              {Array.isArray(project.technologies) &&
              project.technologies.length > 0 ? (
                <p className="mt-3 text-sm text-zinc-500">
                  {project.technologies.filter(Boolean).join(" · ")}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
