import prisma from '~/lib/prisma'
import { json } from '~/utils/formatters'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const hours = Number(query.hours) || 24

  try {
    const metrics = await prisma.taiko_hourly_metric.findMany({
      take: hours,
      orderBy: {
        hour: 'desc'
      },
      select: {
        id: true,
        hour: true,
        block_range: true,
        average_transfer_value: true,
        active_users: true,
        burn_volume: true,
        mint_volume: true,
        transfer_count: true,
        volume: true,
      }
    })
    return json(metrics)
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Failed to fetch daily metrics'
    })
  }
}) 