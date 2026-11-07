import { z } from 'zod'

const EnvSchema = z.object({
  DATABASE_URL: z.string('DATABASE_URL is missing').min(1, 'DATABASE_URL is empty'),
  JWT_SECRET: z
    .string('JWT_SECRET is missing')
    .min(32, 'JWT_SECRET must be at least 32 characters'),
})

const parsed = EnvSchema.safeParse(process.env)

if (!parsed.success) {
  const problems = parsed.error.issues.map((issue) => issue.message).join(', ')
  throw new Error(`Invalid environment variables: ${problems}`)
}

export const env = parsed.data
