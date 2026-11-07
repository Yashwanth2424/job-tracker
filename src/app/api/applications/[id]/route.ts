import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApplicationSchema } from '@/lib/validators'
import { getUserId } from '@/lib/session'
import { ApplicationStatus } from '@prisma/client'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getUserId(req)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const application = await prisma.application.findFirst({
      where: { id, userId },
      include: {
        statusHistory: {
          orderBy: { changedAt: 'desc' },
        },
      },
    })

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    return NextResponse.json({ application })
  } catch (error) {
    console.error('GET application error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getUserId(req)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const parsed = ApplicationSchema.partial().safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const existing = await prisma.application.findFirst({
      where: { id, userId },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    const data = parsed.data
    const statusChanged = data.status && data.status !== existing.status

    const application = await prisma.application.update({
      where: { id },
      data: {
        ...(data.company && { company: data.company }),
        ...(data.role && { role: data.role }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.jobUrl !== undefined && { jobUrl: data.jobUrl }),
        ...(data.salaryExpectation !== undefined && {
          salaryExpectation: data.salaryExpectation,
        }),
        ...(data.status && { status: data.status }),
        ...(data.appliedAt && { appliedAt: new Date(data.appliedAt) }),
        ...(data.followUpDate !== undefined && {
          followUpDate: data.followUpDate ? new Date(data.followUpDate) : null,
        }),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(statusChanged && {
          statusHistory: {
            create: {
              fromStatus: existing.status as ApplicationStatus,
              toStatus: data.status as ApplicationStatus,
            },
          },
        }),
      },
    })

    return NextResponse.json({ application })
  } catch (error) {
    console.error('PATCH application error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getUserId(req)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const existing = await prisma.application.findFirst({
      where: { id, userId },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    await prisma.application.delete({ where: { id } })

    return NextResponse.json({ message: 'Application deleted successfully' })
  } catch (error) {
    console.error('DELETE application error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
