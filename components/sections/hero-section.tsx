import { Button } from "@/components/ui/button";
import type { Profile } from "@/lib/sanity/getProfile";

type Props = {
  profile: Profile | null;
};

export function HeroSection({ profile }: Props) {
  const fullName = [profile?.firstName, profile?.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      id="home"
      className="relative overflow-hidden border-b border-border/60"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.55_0.08_55_/_0.18),transparent_55%),radial-gradient(ellipse_at_bottom_left,oklch(0.32_0.06_255_/_0.14),transparent_50%)]"
      />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-20 sm:px-6 sm:py-28">
        <p className="text-accent text-sm font-semibold tracking-[0.2em] uppercase">
          Software Developer Portfolio
        </p>
        <h1 className="font-heading text-foreground max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
          {fullName || "Portfolio"}
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg leading-8 sm:text-xl">
          {profile?.headline ||
            "Building thoughtful full-stack products with modern web and AI tooling."}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button nativeButton={false} render={<a href="#projects" />}>
            View projects
          </Button>
          <Button
            variant="outline"
            nativeButton={false}
            render={<a href="#contact" />}
          >
            Contact me
          </Button>
        </div>
      </div>
    </section>
  );
}
