import Link from "next/link";
import { TablerNavIcon } from "@/components/nav/tabler-nav-icon";
import { cleanText } from "@/lib/sanity/clean";
import type { NavLink } from "@/lib/sanity/getNavigation";

type Props = {
  links: NavLink[];
  brandName?: string;
};

export function SiteHeader({ links, brandName = "Jesus Flores" }: Props) {
  const sorted = [...links].filter((link) => Boolean(link.href));

  return (
    <header className="border-border/80 bg-background/85 sticky top-0 z-40 border-b backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <a
          href="#home"
          className="font-heading text-foreground text-lg font-semibold tracking-tight"
        >
          {brandName}
        </a>
        <nav
          aria-label="Primary"
          className="flex max-w-full flex-wrap items-center justify-end gap-1 sm:gap-2"
        >
          {sorted.map((link) => {
            const href = link.href ?? "#";
            const isExternal = href.startsWith("http");
            const isPath = href.startsWith("/");
            const iconName = cleanText(link.icon) || undefined;
            const className =
              "text-muted-foreground hover:text-primary inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-medium transition-colors";

            if (isPath) {
              return (
                <Link
                  key={link._key ?? href}
                  href={href}
                  className={className}
                >
                  <TablerNavIcon name={iconName} className="size-4" />
                  <span>{link.label}</span>
                </Link>
              );
            }

            return (
              <a
                key={link._key ?? href}
                href={href}
                target={isExternal && link.openInNewTab ? "_blank" : undefined}
                rel={
                  isExternal && link.openInNewTab ? "noreferrer" : undefined
                }
                className={className}
              >
                <TablerNavIcon name={iconName} className="size-4" />
                <span
                  className={isExternal ? "sr-only sm:not-sr-only" : undefined}
                >
                  {link.label}
                </span>
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
