import { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function getUserId(req: NextRequest) {
  const token = req.cookies.get('token')?.value

  if (!token) {
    return null
  }

  try {
    const payload = await verifyToken(token)
    return payload.userId
  } catch {
    return null
  }
}
