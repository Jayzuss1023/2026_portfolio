import {LinkIcon} from '@sanity/icons/Link'
import {defineField, defineType} from 'sanity'
import {TablerIconInput} from '../../components/TablerIconInput'
import {getTablerIcon, TABLER_NAV_ICONS} from '../../lib/tablerIcons'

function isValidNavHref(value: string): boolean {
  // Page anchors: #home, #about-me
  if (/^#[A-Za-z][\w-]*$/.test(value)) return true
  // Internal paths, optional hash: /projects, /about#contact
  if (/^\/[A-Za-z0-9/_-]*(#[A-Za-z][\w-]*)?$/.test(value)) return true
  // External absolute URLs
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export const navLink = defineType({
  name: 'navLink',
  title: 'Navigation Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required().min(1).max(40),
    }),
    defineField({
      name: 'href',
      title: 'Href',
      type: 'string',
      description: 'External URL (https://…), page path (/projects), or page anchor (#home)',
      placeholder: '#home or https://linkedin.com/in/…',
      validation: (rule) =>
        rule.required().custom((value) => {
          if (!value) return true
          if (isValidNavHref(value)) return true
          return 'Use an external https URL, a path like /projects, or an anchor like #home'
        }),
    }),
    defineField({
      name: 'icon',
      title: 'Tabler Icon',
      type: 'string',
      description: 'Optional Tabler icon shown with this link',
      options: {
        list: TABLER_NAV_ICONS.map(({title, value}) => ({title, value})),
      },
      components: {
        input: TablerIconInput,
      },
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      initialValue: 0,
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in new tab',
      type: 'boolean',
      description: 'Recommended for external links',
      initialValue: false,
      hidden: ({parent}) => typeof parent?.href === 'string' && parent.href.startsWith('#'),
    }),
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'href',
      order: 'order',
      iconName: 'icon',
    },
    prepare({title, subtitle, order, iconName}) {
      const Icon = getTablerIcon(iconName)
      const parts = [
        typeof order === 'number' ? String(order) : null,
        subtitle,
        iconName ? `icon:${iconName}` : null,
      ].filter(Boolean)

      return {
        title: title || 'Untitled link',
        subtitle: parts.join(' · '),
        media: Icon ? <Icon size={18} stroke={1.75} /> : LinkIcon,
      }
    },
  },
})
