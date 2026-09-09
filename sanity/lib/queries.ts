import { defineQuery } from "next-sanity";

export const PROFILE_QUERY = defineQuery(`
  *[_type == "profile"][0]{
    _id,
    firstName,
    lastName,
    headline,
    shortBio,
    fullBio,
    email,
    phone,
    location,
    availabilityStatus,
    socialLinks[]{
      _key,
      platform,
      url,
      label
    },
    profileImage{
      asset->{_id, url},
      alt,
      hotspot,
      crop
    }
  }
`);

export const NAVIGATION_QUERY = defineQuery(`
  *[_type == "navigation"][0]{
    _id,
    title,
    links[]{
      _key,
      label,
      href,
      icon,
      order,
      openInNewTab
    }
  }
`);

export const PROJECTS_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current)]
  | order(featured desc, order asc, _createdAt desc){
    _id,
    title,
    "slug": slug.current,
    "tagline": coalesce(tagline, summary),
    featured,
    category,
    order,
    liveUrl,
    "githubUrl": coalesce(githubUrl, repoUrl),
    "technologies": coalesce(
      technologies[]->name,
      techStack
    ),
    coverImage{
      asset->{_id, url},
      alt,
      hotspot,
      crop
    }
  }
`);

export const PROJECT_QUERY = defineQuery(`
  *[_type == "project" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    "tagline": coalesce(tagline, summary),
    category,
    liveUrl,
    "githubUrl": coalesce(githubUrl, repoUrl),
    "technologies": coalesce(
      technologies[]->name,
      techStack
    ),
    coverImage{
      asset->{_id, url},
      alt,
      hotspot,
      crop
    },
    body
  }
`);

export const PROJECT_SLUGS_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current)]{
    "slug": slug.current
  }
`);

export const SKILLS_QUERY = defineQuery(`
  *[_type == "skill" && defined(name)]
  | order(category asc, name asc){
    _id,
    name,
    category
  }
`);

export const BLOG_POSTS_QUERY = defineQuery(`
  *[_type == "blogPost" && defined(slug.current)]
  | order(coalesce(publishedAt, _createdAt) desc){
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    description
  }
`);

export const BLOG_POST_QUERY = defineQuery(`
  *[_type == "blogPost" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    description
  }
`);

export const BLOG_SLUGS_QUERY = defineQuery(`
  *[_type == "blogPost" && defined(slug.current)]{
    "slug": slug.current
  }
`);
