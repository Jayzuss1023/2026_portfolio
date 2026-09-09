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
} from "@tabler/icons-react";

const iconMap: Record<string, Icon> = {
  home: IconHome,
  user: IconUser,
  briefcase: IconBriefcase,
  folder: IconFolder,
  code: IconCode,
  "file-text": IconFileText,
  mail: IconMail,
  phone: IconPhone,
  link: IconLink,
  "brand-github": IconBrandGithub,
  "brand-linkedin": IconBrandLinkedin,
};

export function TablerNavIcon({
  name,
  ...props
}: { name?: string } & Omit<IconProps, "name">) {
  if (!name) return null;
  const IconComponent = iconMap[name];
  if (!IconComponent) return null;
  return <IconComponent stroke={1.75} {...props} />;
}
