"use client";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SkillCategoryGroup } from "@/lib/sanity/getSkills";

type Props = {
  groups: SkillCategoryGroup[];
};

export function SkillsSection({ groups }: Props) {
  if (groups.length === 0) {
    return (
      <section id="skills" className="border-border/60 border-b">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <p className="text-muted-foreground text-sm">
            Skills will appear here once added in Sanity.
          </p>
        </div>
      </section>
    );
  }

  const defaultValue = groups[0]?.category;

  return (
    <section id="skills" className="border-border/60 border-b">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-16 sm:px-6">
        <div className="flex flex-col gap-2">
          <p className="text-accent text-sm font-semibold tracking-[0.18em] uppercase">
            Skills
          </p>
          <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Tools by category
          </h2>
          <p className="text-muted-foreground max-w-2xl text-base leading-7">
            A living inventory of languages, frameworks, platforms, and
            practices from Sanity.
          </p>
        </div>

        <Tabs defaultValue={defaultValue}>
          <TabsList variant="line" className="h-auto w-full flex-wrap justify-start gap-1">
            {groups.map((group) => (
              <TabsTrigger key={group.category} value={group.category}>
                {group.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {groups.map((group) => (
            <TabsContent
              key={group.category}
              value={group.category}
              className="mt-6"
            >
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <Badge key={skill._id} variant="secondary" className="px-3 py-1">
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
