import Image from "next/image";
import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
  IconBrandYoutube,
  IconLink,
  IconMail,
} from "@tabler/icons-react";
import { PortableTextBody } from "@/components/portable-text";
import { Badge } from "@/components/ui/badge";
import { cleanText } from "@/lib/sanity/clean";
import type { Profile } from "@/lib/sanity/getProfile";
import { urlFor } from "@/sanity/lib/image";

const availabilityCopy: Record<string, string> = {
  "available-for-hire": "Available for hire",
  "open-to-opportunities": "Open to opportunities",
  "not-available": "Not available",
};

const socialIcons = {
  github: IconBrandGithub,
  linkedin: IconBrandLinkedin,
  website: IconLink,
  other: IconLink,
  instagram: IconBrandInstagram,
  x: IconBrandX,
  youtube: IconBrandYoutube,
} as const;

type Props = {
  profile: Profile | null;
};

export function AboutSection({ profile }: Props) {
  if (!profile) {
    return (
      <section id="about" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-muted-foreground">Profile content coming soon.</p>
      </section>
    );
  }

  const fullName = [profile.firstName, profile.lastName]
    .filter(Boolean)
    .join(" ");
  const imageUrl = profile.profileImage?.asset
    ? urlFor(profile.profileImage).width(800).height(1000).fit("crop").url()
    : null;
  const statusLabel =
    availabilityCopy[profile.availabilityStatus ?? ""] ??
    profile.availabilityStatus;

  return (
    <section id="about" className="border-border/60 border-b">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
        <div className="relative mx-auto w-full max-w-md">
          <div className="bg-muted relative aspect-[4/5] overflow-hidden rounded-2xl">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={profile.profileImage?.alt || fullName || "Portrait"}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 420px"
                priority
              />
            ) : (
              <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
                Add a profile image in Sanity
              </div>
            )}
            {statusLabel ? (
              <Badge className="bg-accent text-accent-foreground absolute right-3 bottom-3 shadow-sm">
                {statusLabel}
              </Badge>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <p className="text-accent text-sm font-semibold tracking-[0.18em] uppercase">
              About me
            </p>
            <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              {fullName}
            </h2>
            <p className="text-muted-foreground text-lg leading-8 whitespace-pre-line">
              {profile.shortBio}
            </p>
          </div>

          {profile.fullBio ? (
            <div className="prose-portfolio max-w-none">
              <PortableTextBody value={profile.fullBio} />
            </div>
          ) : null}

          {profile.socialLinks && profile.socialLinks.length > 0 ? (
            <div className="flex flex-wrap gap-3 pt-2">
              {profile.socialLinks.map((link) => {
                if (!link?.url) return null;
                const platform = cleanText(link.platform);
                const Icon =
                  platform && platform in socialIcons
                    ? socialIcons[platform as keyof typeof socialIcons]
                    : IconLink;
                return (
                  <a
                    key={link._key ?? link.url}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="border-border bg-card text-foreground hover:border-primary inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors"
                  >
                    <Icon className="size-4" stroke={1.75} />
                    {link.label || platform || "Link"}
                  </a>
                );
              })}
              {profile.email ? (
                <a
                  href={`mailto:${profile.email}`}
                  className="border-border bg-card text-foreground hover:border-primary inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors"
                >
                  <IconMail className="size-4" stroke={1.75} />
                  Email
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
