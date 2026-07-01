import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApplicationSchema } from '@/lib/validators'
import { verifyToken } from '@/lib/auth'
import { ApplicationStatus } from '@prisma/client'

async function getUserId(req: NextRequest): Promise<string | null> {
  try {
    const token = req.cookies.get('token')?.value

    if (!token) {
      return null
    }

    const payload = await verifyToken(token)

    return payload.userId
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId(req)

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)

    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const applications = await prisma.application.findMany({
      where: {
        userId,

        ...(status && {
          status: status as ApplicationStatus,
        }),

        ...(search && {
          OR: [
            {
              company: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              role: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        }),
      },

      include: {
        statusHistory: {
          orderBy: {
            changedAt: 'desc',
          },
          take: 1,
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ applications })
  } catch (error) {
    console.error('GET applications error:', error)

    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId(req)

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()

    const parsed = ApplicationSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.issues[0].message,
        },
        {
          status: 400,
        }
      )
    }

    const data = parsed.data

    const application = await prisma.application.create({
      data: {
        userId,
        company: data.company,
        role: data.role,
        location: data.location,
        jobUrl: data.jobUrl,
        salaryExpectation: data.salaryExpectation,
        status: data.status,
        appliedAt: data.appliedAt
          ? new Date(data.appliedAt)
          : null,
        followUpDate: data.followUpDate
          ? new Date(data.followUpDate)
          : null,
        notes: data.notes,

        statusHistory: {
          create: {
            toStatus: data.status,
          },
        },
      },
    })

    return NextResponse.json(
      { application },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST application error:', error)

    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}