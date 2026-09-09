import {BoltIcon} from '@sanity/icons/Bolt'
import {defineField, defineType} from 'sanity'

export const skill = defineType({
  name: 'skill',
  title: 'Skill',
  type: 'document',
  icon: BoltIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Skill Name',
      type: 'string',
      validation: (rule) => rule.required().min(1).max(80),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Testing & Delivery', value: 'testing-delivery'},
          {title: 'AI & LLM', value: 'ai-llm'},
          {title: 'Databases & Data', value: 'databases-data'},
          {title: 'Software Design & OOP', value: 'software-design-oop'},
          {title: 'Languages & Frameworks', value: 'languages-frameworks'},
          {title: 'Cloud & DevOps', value: 'cloud-devops'},
          {title: 'Data Engineering', value: 'data-engineering'},
          {title: 'APIs & Integration', value: 'apis-integration'},
          {title: 'Authentication & Security', value: 'authentication-security'},
          {title: 'Tools & Practices', value: 'tools-practices'},
          {title: 'Dev Tools & AI Assistants', value: 'dev-tools-ai-assistants'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: 'Name A–Z',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
    {
      title: 'Category',
      name: 'categoryAsc',
      by: [
        {field: 'category', direction: 'asc'},
        {field: 'name', direction: 'asc'},
      ],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
    },
  },
})
