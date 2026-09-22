import type { Access, AccessResult, FieldAccess } from 'payload'
export const isStaff = (user: any) => Boolean(user?.active && ['admin', 'editor', 'writer'].includes(user.role))
export const isEditor = (user: any) => isStaff(user) && ['admin', 'editor'].includes(user.role)
export const isAdmin = (user: any) => isStaff(user) && user.role === 'admin'
export const staff: Access = ({ req }) => isStaff(req.user)
export const editors: Access = ({ req }) => isEditor(req.user)
export const admins: Access = ({ req }) => isAdmin(req.user)
export const adminField: FieldAccess = ({ req }) => isAdmin(req.user)
export const staffField: FieldAccess = ({ req }) => isStaff(req.user)
export const publishedOrTeam: Access = ({ req }): AccessResult => {
 if (isEditor(req.user)) return true
 if (isStaff(req.user)) return { or: [{ owner: { equals: req.user!.id } }, { _status: { equals: 'published' } }] }
 return { _status: { equals: 'published' } }
}
export const editPosts: Access = ({ req }): AccessResult => isEditor(req.user) ? true : isStaff(req.user) ? { and: [{ owner: { equals: req.user!.id } }, { _status: { equals: 'draft' } }] } : false
export const ownVersions: Access = ({ req }) => isEditor(req.user) ? true : isStaff(req.user) ? { owner: { equals: req.user!.id } } : false
export const httpsURL = (value: unknown) => !value || (typeof value === 'string' && /^https:\/\/[^\s]+$/i.test(value)) || 'Enter a full HTTPS URL.'
