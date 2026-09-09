import {defineLocations, type PresentationPluginOptions} from 'sanity/presentation'

export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    project: defineLocations({
      select: {
        title: 'title',
        slug: 'slug.current',
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || 'Untitled project',
            href: doc?.slug ? `/projects/${doc.slug}` : '/',
          },
          {title: 'Projects index', href: '/'},
        ],
      }),
    }),
    blogPost: defineLocations({
      select: {
        title: 'title',
        slug: 'slug.current',
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || 'Untitled post',
            href: doc?.slug ? `/blog/${doc.slug}` : '/blog',
          },
          {title: 'Blog index', href: '/blog'},
        ],
      }),
    }),
  },
}
