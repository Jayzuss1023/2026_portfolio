import {UserIcon} from '@sanity/icons/User'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const profile = defineType({
  name: 'profile',
  title: 'Profile',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'shortBio',
      title: 'Short Bio',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().max(280),
    }),
    defineField({
      name: 'fullBio',
      title: 'Full Bio',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
    }),
    defineField({
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
      description: 'Include country code when possible (e.g. +1 555 123 4567)',
      validation: (rule) =>
        rule.custom((value) => {
          if (!value) return true
          const cleaned = value.replace(/[\s().-]/g, '')
          if (!/^\+?[0-9]{7,15}$/.test(cleaned)) {
            return 'Enter a valid phone number (7–15 digits, optional leading +)'
          }
          return true
        }),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'City and ZIP/postal code',
    }),
    defineField({
      name: 'availabilityStatus',
      title: 'Available Status',
      type: 'string',
      options: {
        list: [
          {title: 'Available for hire', value: 'available-for-hire'},
          {title: 'Open to opportunities', value: 'open-to-opportunities'},
          {title: 'Not available', value: 'not-available'},
        ],
        layout: 'radio',
      },
      initialValue: 'open-to-opportunities',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [defineArrayMember({type: 'socialLink'})],
    }),
  ],
  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      headline: 'headline',
      media: 'profileImage',
    },
    prepare({firstName, lastName, headline, media}) {
      const name = [firstName, lastName].filter(Boolean).join(' ')
      return {
        title: name || 'Profile',
        subtitle: headline,
        media,
      }
    },
  },
})
