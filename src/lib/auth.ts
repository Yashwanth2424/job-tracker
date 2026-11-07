import { SignJWT, jwtVerify } from 'jose'
import { z } from 'zod'
import { env } from '@/lib/env'

const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET)

const PayloadSchema = z.object({
  userId: z.string(),
  email: z.string(),
})

export type JwtPayload = z.infer<typeof PayloadSchema>

export async function signToken(payload: JwtPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<JwtPayload> {
  const { payload } = await jwtVerify(token, JWT_SECRET)
  return PayloadSchema.parse(payload)
}
