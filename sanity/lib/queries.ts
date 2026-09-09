import { defineQuery } from "next-sanity";

export const PROJECTS_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current)]
  | order(featured desc, order asc, _createdAt desc){
    _id,
    title,
    "slug": slug.current,
    "tagline": coalesce(tagline, summary),
    featured,
    category,
    "technologies": coalesce(
      technologies[]->name,
      techStack
    )
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
    body
  }
`);

export const PROJECT_SLUGS_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current)]{
    "slug": slug.current
  }
`);
