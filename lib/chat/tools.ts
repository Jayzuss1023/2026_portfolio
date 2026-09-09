import { tool } from "ai";
import { z } from "zod";
import { portableTextToPlain } from "@/lib/chat/portable-text-plain";
import { cleanText } from "@/lib/sanity/clean";
import { getBlogPostBySlug } from "@/lib/sanity/getBlogPostBySlug";
import { getProjectBySlug } from "@/lib/sanity/getProjectBySlug";
import { getSkillsByCategory } from "@/lib/sanity/getSkills";

export function createChatTools() {
  return {
    getProjectDetails: tool({
      description:
        "Fetch full details for one portfolio project by slug (body, links, technologies).",
      inputSchema: z.object({
        slug: z.string().min(1).describe("Project slug from the snapshot list"),
      }),
      execute: async ({ slug }) => {
        const project = await getProjectBySlug(slug, { stega: false });
        if (!project) return { found: false as const, slug };
        return {
          found: true as const,
          title: cleanText(project.title),
          slug: cleanText(project.slug),
          tagline: cleanText(project.tagline),
          category: cleanText(project.category),
          liveUrl: cleanText(project.liveUrl),
          githubUrl: cleanText(project.githubUrl),
          technologies: (project.technologies ?? [])
            .map((t) => cleanText(t))
            .filter(Boolean),
          body: portableTextToPlain(project.body),
          detailPath: `/projects/${cleanText(project.slug)}`,
        };
      },
    }),
    getBlogPost: tool({
      description: "Fetch one blog post by slug including plain-text body.",
      inputSchema: z.object({
        slug: z.string().min(1).describe("Blog post slug from the snapshot list"),
      }),
      execute: async ({ slug }) => {
        const post = await getBlogPostBySlug(slug, { stega: false });
        if (!post) return { found: false as const, slug };
        return {
          found: true as const,
          title: cleanText(post.title),
          slug: cleanText(post.slug),
          publishedAt: cleanText(post.publishedAt),
          body: portableTextToPlain(post.description),
          detailPath: `/blog/${cleanText(post.slug)}`,
        };
      },
    }),
    listSkillsByCategory: tool({
      description:
        "List skills grouped by category. Optionally filter to one category value.",
      inputSchema: z.object({
        category: z
          .string()
          .optional()
          .describe("Optional category value such as languages-frameworks"),
      }),
      execute: async ({ category }) => {
        const groups = await getSkillsByCategory();
        const filtered = category
          ? groups.filter((g) => g.category === category)
          : groups;
        return filtered.map((g) => ({
          category: g.category,
          label: g.label,
          skills: g.skills.map((s) => s.name),
        }));
      },
    }),
  };
}
