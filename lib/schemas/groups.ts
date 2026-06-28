import { z } from 'zod'

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const hexColorRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

export const CreateGroupSchema = z.object({
  name: z.string().trim().min(1, 'Name ist erforderlich').max(100),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug ist erforderlich')
    .max(100)
    .regex(slugRegex, 'Slug darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten'),
  short_desc: z.string().trim().max(500).nullish().transform((v) => v ?? null),
  logo_url: z.string().trim().max(2048).url('Ungültige URL').nullish().transform((v) => v ?? null),
  color: z.string().trim().regex(hexColorRegex, 'Ungültige Farbe').default('#2EC4C6'),
  sort_order: z.coerce.number().int().min(0).default(0),
  is_active: z.coerce.boolean().default(true),
})

export const UpdateGroupSchema = CreateGroupSchema.partial()

export const ReorderGroupsSchema = z.object({
  order: z
    .array(
      z.object({
        id: z.string().uuid(),
        sort_order: z.coerce.number().int().min(0),
      })
    )
    .min(1),
})

export type CreateGroupInput = z.infer<typeof CreateGroupSchema>
export type UpdateGroupInput = z.infer<typeof UpdateGroupSchema>
export type ReorderGroupsInput = z.infer<typeof ReorderGroupsSchema>
