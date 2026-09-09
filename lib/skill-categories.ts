export const SKILL_CATEGORY_LABELS = {
  "testing-delivery": "Testing & Delivery",
  "ai-llm": "AI & LLM",
  "databases-data": "Databases & Data",
  "software-design-oop": "Software Design & OOP",
  "languages-frameworks": "Languages & Frameworks",
  "cloud-devops": "Cloud & DevOps",
  "data-engineering": "Data Engineering",
  "apis-integration": "APIs & Integration",
  "authentication-security": "Authentication & Security",
  "tools-practices": "Tools & Practices",
  "dev-tools-ai-assistants": "Dev Tools & AI Assistants",
} as const;

export type SkillCategoryValue = keyof typeof SKILL_CATEGORY_LABELS;

export function skillCategoryLabel(value: string | null | undefined): string {
  if (!value) return "Other";
  if (value in SKILL_CATEGORY_LABELS) {
    return SKILL_CATEGORY_LABELS[value as SkillCategoryValue];
  }
  return value;
}
