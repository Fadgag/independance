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

const isMissingColumn = (err: unknown) => {
  const msg = String((err as Error)?.message ?? '').toLowerCase()
  return msg.includes('openingtime') || msg.includes('closingtime') || msg.includes('does not exist') || msg.includes('p2022')
}

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const orgId = session.user?.organizationId
    if (!orgId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    // Fallback: si les colonnes openingTime/closingTime n'existent pas encore en DB,
    // retomber sur une requête sans ces champs pour ne pas crasher.
    try {
      const org = await prisma.organization.findUnique({ where: { id: orgId }, select: { dailyTarget: true, openingTime: true, closingTime: true } })
      return NextResponse.json({ dailyTarget: org?.dailyTarget ?? 0, openingTime: org?.openingTime ?? '08:00', closingTime: org?.closingTime ?? '20:00' })
    } catch (err) {
      if (!isMissingColumn(err)) throw err
      const org = await prisma.organization.findUnique({ where: { id: orgId }, select: { dailyTarget: true } })
      return NextResponse.json({ dailyTarget: org?.dailyTarget ?? 0, openingTime: '08:00', closingTime: '20:00' })
    }
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

    // Fallback: ignorer openingTime/closingTime si les colonnes n'existent pas encore en DB
    try {
      if (openingTime !== undefined) data.openingTime = openingTime
      if (closingTime !== undefined) data.closingTime = closingTime
      const updated = await prisma.organization.update({ where: { id: orgId }, data })
      return NextResponse.json({ dailyTarget: updated.dailyTarget, openingTime: updated.openingTime ?? '08:00', closingTime: updated.closingTime ?? '20:00' })
    } catch (err) {
      if (!isMissingColumn(err)) throw err
      // Colonnes absentes : sauvegarder uniquement dailyTarget
      const fallbackData: Record<string, unknown> = {}
      if (dailyTarget !== undefined) fallbackData.dailyTarget = dailyTarget
      const updated = await prisma.organization.update({ where: { id: orgId }, data: fallbackData })
      return NextResponse.json({ dailyTarget: updated.dailyTarget, openingTime: '08:00', closingTime: '20:00' })
    }
  } catch (err) {
    return apiErrorResponse(err)
  }
}
