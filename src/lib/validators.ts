import { z } from 'zod'

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const ApplicationSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Role is required'),
  location: z.string().optional(),
  jobUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  salaryExpectation: z.string().optional(),
  status: z.enum(['SAVED', 'APPLIED', 'INTERVIEW_SCHEDULED', 'INTERVIEW_DONE', 'OFFER', 'REJECTED', 'WITHDRAWN']),
  appliedAt: z.string().optional(),
  followUpDate: z.string().optional(),
  notes: z.string().optional(),
})

export type RegisterInput = z.infer<typeof RegisterSchema>
export type LoginInput = z.infer<typeof LoginSchema>
export type ApplicationInput = z.infer<typeof ApplicationSchema>