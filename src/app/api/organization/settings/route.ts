import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { z } from 'zod'
import apiErrorResponse from '@/lib/api'

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/

const PatchSettingsSchema = z.object({
  dailyTarget: z.number().nonnegative().optional(),
  openingTime: z.string().regex(timeRegex, 'Format HH:MM attendu').optional(),
  closingTime: z.string().regex(timeRegex, 'Format HH:MM attendu').optional(),
})

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const orgId = session.user?.organizationId
    if (!orgId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const org = await prisma.organization.findUnique({ where: { id: orgId }, select: { dailyTarget: true, openingTime: true, closingTime: true } })
    return NextResponse.json({ dailyTarget: org?.dailyTarget ?? 0, openingTime: org?.openingTime ?? '08:00', closingTime: org?.closingTime ?? '20:00' })
  } catch (err) {
    return apiErrorResponse(err)
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const orgId = session.user?.organizationId
    if (!orgId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const parsed = PatchSettingsSchema.safeParse(await request.json())
    if (!parsed.success) return NextResponse.json({ error: 'Invalid payload', details: parsed.error.format() }, { status: 400 })
    const { dailyTarget, openingTime, closingTime } = parsed.data
    const data: Record<string, unknown> = {}
    if (dailyTarget !== undefined) data.dailyTarget = dailyTarget
    if (openingTime !== undefined) data.openingTime = openingTime
    if (closingTime !== undefined) data.closingTime = closingTime

    const updated = await prisma.organization.update({ where: { id: orgId }, data })
    return NextResponse.json({ dailyTarget: updated.dailyTarget, openingTime: updated.openingTime, closingTime: updated.closingTime })
  } catch (err) {
    return apiErrorResponse(err)
  }
}





