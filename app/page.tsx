import { AboutSection } from "@/components/sections/about-section";
import { BlogSection } from "@/components/sections/blog-section";
import { ContactSection } from "@/components/sections/contact-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { SiteHeader } from "@/components/nav/site-header";
import { getPortfolioPage } from "@/lib/sanity/getPortfolioPage";

export default async function Home() {
  const data = await getPortfolioPage();
  const brandName = [data.profile?.firstName, data.profile?.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <SiteHeader
        links={data.navigation?.links ?? []}
        brandName={brandName || "Portfolio"}
      />
      <main className="flex flex-1 flex-col">
        <HeroSection profile={data.profile} />
        <AboutSection profile={data.profile} />
        <ProjectsSection projects={data.projects} />
        <SkillsSection groups={data.skillsByCategory} />
        <BlogSection posts={data.blogPosts} />
        <ContactSection profile={data.profile} />
      </main>
    </>
  );
}
