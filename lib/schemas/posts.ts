import { z } from 'zod'

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const CreatePostSchema = z.object({
  title: z.string().trim().min(1, 'Titel ist erforderlich').max(200),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug ist erforderlich')
    .max(200)
    .regex(slugRegex, 'Slug darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten'),
  content: z.string().min(1, 'Inhalt ist erforderlich'),
  cover_image: z
    .string()
    .trim()
    .max(2048)
    .url('Ungültige URL')
    .nullish()
    .transform((v) => v ?? null),
  tags: z.array(z.string().trim().min(1).max(50)).max(20).default([]),
  published: z.coerce.boolean().default(false),
})

export const UpdatePostSchema = CreatePostSchema.partial()

export type CreatePostInput = z.infer<typeof CreatePostSchema>
export type UpdatePostInput = z.infer<typeof UpdatePostSchema>
