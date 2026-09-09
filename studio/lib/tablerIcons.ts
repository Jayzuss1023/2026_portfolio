import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBriefcase,
  IconCode,
  IconFileText,
  IconFolder,
  IconHome,
  IconLink,
  IconMail,
  IconPhone,
  IconUser,
  type Icon,
  type IconProps,
} from '@tabler/icons-react'
import type {ComponentType} from 'react'

export type TablerIconName =
  | 'home'
  | 'user'
  | 'briefcase'
  | 'folder'
  | 'code'
  | 'file-text'
  | 'mail'
  | 'phone'
  | 'link'
  | 'brand-github'
  | 'brand-linkedin'

type TablerIconOption = {
  title: string
  value: TablerIconName
  icon: ComponentType<IconProps>
}

export const TABLER_NAV_ICONS: TablerIconOption[] = [
  {title: 'Home', value: 'home', icon: IconHome},
  {title: 'User', value: 'user', icon: IconUser},
  {title: 'Briefcase', value: 'briefcase', icon: IconBriefcase},
  {title: 'Folder', value: 'folder', icon: IconFolder},
  {title: 'Code', value: 'code', icon: IconCode},
  {title: 'File text', value: 'file-text', icon: IconFileText},
  {title: 'Mail', value: 'mail', icon: IconMail},
  {title: 'Phone', value: 'phone', icon: IconPhone},
  {title: 'Link', value: 'link', icon: IconLink},
  {title: 'GitHub', value: 'brand-github', icon: IconBrandGithub},
  {title: 'LinkedIn', value: 'brand-linkedin', icon: IconBrandLinkedin},
]

const iconMap = Object.fromEntries(
  TABLER_NAV_ICONS.map((option) => [option.value, option.icon]),
) as Record<TablerIconName, Icon>

export function getTablerIcon(name?: string | null): Icon | undefined {
  if (!name) return undefined
  return iconMap[name as TablerIconName]
}
