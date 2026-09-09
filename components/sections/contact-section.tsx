import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
  IconBrandYoutube,
  IconLink,
  IconMail,
  IconMapPin,
  IconPhone,
} from "@tabler/icons-react";
import { ContactForm } from "@/components/sections/contact-form";
import { Separator } from "@/components/ui/separator";
import { cleanText } from "@/lib/sanity/clean";
import type { Profile } from "@/lib/sanity/getProfile";

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

export function ContactSection({ profile }: Props) {
  return (
    <section id="contact">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-accent text-sm font-semibold tracking-[0.18em] uppercase">
              Contact
            </p>
            <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Let&apos;s work together
            </h2>
            <p className="text-muted-foreground max-w-md text-base leading-7">
              Send a note about a role, collaboration, or project. Messages are
              stored securely in Sanity.
            </p>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            {profile?.email ? (
              <a
                href={`mailto:${profile.email}`}
                className="text-foreground hover:text-primary inline-flex items-center gap-2 transition-colors"
              >
                <IconMail className="size-4 shrink-0" stroke={1.75} />
                {profile.email}
              </a>
            ) : null}
            {profile?.phone ? (
              <a
                href={`tel:${profile.phone.replace(/\s+/g, "")}`}
                className="text-foreground hover:text-primary inline-flex items-center gap-2 transition-colors"
              >
                <IconPhone className="size-4 shrink-0" stroke={1.75} />
                {profile.phone}
              </a>
            ) : null}
            {profile?.location ? (
              <p className="text-muted-foreground inline-flex items-center gap-2">
                <IconMapPin className="size-4 shrink-0" stroke={1.75} />
                {profile.location}
              </p>
            ) : null}
          </div>

          {profile?.socialLinks && profile.socialLinks.length > 0 ? (
            <div className="flex flex-col gap-3">
              <Separator />
              <p className="text-sm font-medium">Follow me</p>
              <div className="flex flex-wrap gap-2">
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
                      className="border-border bg-card hover:border-primary inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors"
                    >
                      <Icon className="size-4" stroke={1.75} />
                      {link.label || platform || "Link"}
                    </a>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        <div className="bg-card border-border rounded-2xl border p-5 sm:p-6">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
