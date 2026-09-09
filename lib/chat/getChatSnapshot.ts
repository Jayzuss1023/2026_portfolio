import { cleanText } from "@/lib/sanity/clean";
import { getBlogPosts } from "@/lib/sanity/getBlogPosts";
import { getProfile } from "@/lib/sanity/getProfile";
import { getProjects } from "@/lib/sanity/getProjects";
import { getSkillsByCategory } from "@/lib/sanity/getSkills";

export type ChatSnapshot = {
  profile: {
    fullName: string;
    headline: string;
    shortBio: string;
    availabilityStatus: string;
    email: string;
    phone: string;
    location: string;
    socialLinks: Array<{ platform: string; label: string; url: string }>;
  };
  skillsByCategory: Array<{ category: string; label: string; skills: string[] }>;
  projects: Array<{
    title: string;
    slug: string;
    tagline: string;
    featured: boolean;
    category: string;
  }>;
  blogPosts: Array<{ title: string; slug: string; publishedAt: string }>;
};

export async function getChatSnapshot(): Promise<ChatSnapshot> {
  const [profile, projects, skillsByCategory, blogPosts] = await Promise.all([
    getProfile(),
    getProjects(),
    getSkillsByCategory(),
    getBlogPosts(),
  ]);

  const fullName = [profile?.firstName, profile?.lastName]
    .filter(Boolean)
    .map((part) => cleanText(part))
    .join(" ");

  return {
    profile: {
      fullName,
      headline: cleanText(profile?.headline),
      shortBio: cleanText(profile?.shortBio),
      availabilityStatus: cleanText(profile?.availabilityStatus),
      email: cleanText(profile?.email),
      phone: cleanText(profile?.phone),
      location: cleanText(profile?.location),
      socialLinks: (profile?.socialLinks ?? []).flatMap((link) => {
        const url = cleanText(link?.url);
        if (!url) return [];
        return [
          {
            platform: cleanText(link?.platform),
            label: cleanText(link?.label),
            url,
          },
        ];
      }),
    },
    skillsByCategory: skillsByCategory.map((group) => ({
      category: group.category,
      label: group.label,
      skills: group.skills.map((s) => s.name),
    })),
    projects: projects.flatMap((project) => {
      const slug = cleanText(project.slug);
      if (!slug) return [];
      return [
        {
          title: cleanText(project.title),
          slug,
          tagline: cleanText(project.tagline),
          featured: Boolean(project.featured),
          category: cleanText(project.category),
        },
      ];
    }),
    blogPosts: blogPosts.flatMap((post) => {
      const slug = cleanText(post.slug);
      if (!slug) return [];
      return [
        {
          title: cleanText(post.title),
          slug,
          publishedAt: cleanText(post.publishedAt),
        },
      ];
    }),
  };
}
