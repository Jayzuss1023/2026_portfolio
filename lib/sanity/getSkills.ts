import { cleanText } from "@/lib/sanity/clean";
import {
  skillCategoryLabel,
  type SkillCategoryValue,
  SKILL_CATEGORY_LABELS,
} from "@/lib/skill-categories";
import { sanityFetch } from "@/sanity/lib/live";
import { SKILLS_QUERY } from "@/sanity/lib/queries";

export type SkillItem = {
  _id: string;
  name: string;
  category: string;
};

export type SkillCategoryGroup = {
  category: string;
  label: string;
  skills: SkillItem[];
};

export async function getSkills() {
  const { data } = await sanityFetch({ query: SKILLS_QUERY });
  return (data ?? []).flatMap((skill) => {
    const name = cleanText(skill.name);
    const category = cleanText(skill.category);
    if (!name || !category) return [];
    return [{ _id: skill._id, name, category }];
  });
}

export async function getSkillsByCategory(): Promise<SkillCategoryGroup[]> {
  const skills = await getSkills();
  const buckets = new Map<string, SkillItem[]>();

  for (const skill of skills) {
    const list = buckets.get(skill.category) ?? [];
    list.push(skill);
    buckets.set(skill.category, list);
  }

  const knownOrder = Object.keys(SKILL_CATEGORY_LABELS) as SkillCategoryValue[];
  const orderedKeys = [
    ...knownOrder.filter((key) => buckets.has(key)),
    ...[...buckets.keys()].filter(
      (key) => !(key in SKILL_CATEGORY_LABELS),
    ),
  ];

  return orderedKeys.map((category) => ({
    category,
    label: skillCategoryLabel(category),
    skills: buckets.get(category) ?? [],
  }));
}
