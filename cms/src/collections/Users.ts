import { APIError, type CollectionConfig } from 'payload'
import { admins, adminField, isAdmin, isStaff } from '../lib/access'
export const Users: CollectionConfig = {
 slug: 'users', labels: { singular: 'Team member', plural: 'Publishing team' },
 admin: { useAsTitle: 'name', group: 'Administration', defaultColumns: ['name', 'email', 'role', 'active'] },
 auth: { tokenExpiration: 7200, maxLoginAttempts: 5, lockTime: 600000, cookies: { sameSite: 'Lax', secure: process.env.NODE_ENV === 'production' } },
 access: {
  admin: ({ req }) => isStaff(req.user), create: admins, delete: () => false,
  read: ({ req }) => isAdmin(req.user) ? true : isStaff(req.user) ? { id: { equals: req.user!.id } } : false,
  update: ({ req }) => isAdmin(req.user) ? true : isStaff(req.user) ? { id: { equals: req.user!.id } } : false,
 },
 hooks: {
  beforeOperation: [({ args, operation }) => {
   if (operation === 'resetPassword' && 'data' in args && typeof args.data?.password === 'string' && args.data.password.length < 16) throw new APIError('Use a password with at least 16 characters.', 400)
   return args
  }],
  beforeLogin: [({ user }) => { if (!user.active) throw new APIError('This account is inactive. Contact your administrator.', 403) }],
  beforeChange: [({ data, req, originalDoc }) => {
   if (data.password && data.password.length < 16) throw new APIError('Use a password with at least 16 characters.', 400)
   if (originalDoc?.id === req.user?.id && originalDoc.role === 'admin' && (data.active === false || (data.role && data.role !== 'admin'))) throw new APIError('Another administrator must change your administrative access.', 400)
   return data
  }],
 },
 fields: [
  { name: 'name', type: 'text', required: true },
  { name: 'role', type: 'select', required: true, defaultValue: 'writer', options: [{ label: 'Administrator', value: 'admin' }, { label: 'Editor', value: 'editor' }, { label: 'Writer', value: 'writer' }], access: { create: adminField, update: adminField } },
  { name: 'active', type: 'checkbox', defaultValue: true, access: { create: adminField, update: adminField }, admin: { description: 'Disable access without deleting attribution or editorial history.' } },
 ],
}
