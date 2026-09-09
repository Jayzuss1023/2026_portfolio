import {blogPost} from './documents/blogPost'
import {contactMessage} from './documents/contactMessage'
import {navigation} from './documents/navigation'
import {profile} from './documents/profile'
import {project} from './documents/project'
import {skill} from './documents/skill'
import {navLink} from './objects/navLink'
import {socialLink} from './objects/socialLink'

export const schemaTypes = [
  // Objects
  socialLink,
  navLink,
  // Documents
  profile,
  navigation,
  skill,
  project,
  blogPost,
  contactMessage,
]
