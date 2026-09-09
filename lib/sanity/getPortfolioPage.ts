import { getBlogPosts } from "@/lib/sanity/getBlogPosts";
import { getNavigation } from "@/lib/sanity/getNavigation";
import { getProfile } from "@/lib/sanity/getProfile";
import { getProjects } from "@/lib/sanity/getProjects";
import { getSkillsByCategory } from "@/lib/sanity/getSkills";

export async function getPortfolioPage() {
  const [profile, navigation, projects, skillsByCategory, blogPosts] =
    await Promise.all([
      getProfile(),
      getNavigation(),
      getProjects(),
      getSkillsByCategory(),
      getBlogPosts(),
    ]);

  return {
    profile,
    navigation,
    projects,
    skillsByCategory,
    blogPosts,
  };
}

export type PortfolioPageData = Awaited<ReturnType<typeof getPortfolioPage>>;
