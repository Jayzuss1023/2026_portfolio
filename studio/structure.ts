import type {StructureResolver} from 'sanity/structure'
import {CaseIcon} from '@sanity/icons/Case'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {EnvelopeIcon} from '@sanity/icons/Envelope'
import {MenuIcon} from '@sanity/icons/Menu'
import {BoltIcon} from '@sanity/icons/Bolt'
import {UserIcon} from '@sanity/icons/User'

const SINGLETONS = ['profile', 'navigation'] as const

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Portfolio Content')
    .items([
      S.listItem()
        .title('Profile')
        .icon(UserIcon)
        .child(S.document().schemaType('profile').documentId('profile').title('Profile')),
      S.listItem()
        .title('Navigation')
        .icon(MenuIcon)
        .child(S.document().schemaType('navigation').documentId('navigation').title('Navigation')),
      S.divider(),
      S.documentTypeListItem('project').title('Projects').icon(CaseIcon),
      S.documentTypeListItem('skill').title('Skills').icon(BoltIcon),
      S.documentTypeListItem('blogPost').title('Blog Posts').icon(DocumentTextIcon),
      S.divider(),
      S.documentTypeListItem('contactMessage').title('Contact Messages').icon(EnvelopeIcon),
      S.divider(),
      ...S.documentTypeListItems().filter((listItem) => {
        const id = listItem.getId()
        return (
          id !== undefined &&
          !SINGLETONS.includes(id as (typeof SINGLETONS)[number]) &&
          !['project', 'skill', 'blogPost', 'contactMessage', 'profile', 'navigation'].includes(id)
        )
      }),
    ])
