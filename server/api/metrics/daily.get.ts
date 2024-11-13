import prisma from '~/lib/prisma'
import { json } from '~/utils/formatters'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const days = Number(query.days) || 30

  try {
    const metrics = await prisma.taiko_daily_metric.findMany({
      take: days,
      orderBy: {
        date: 'desc'
      },
      select: {
        active_users: false, 
        average_transfer_value: true, 
        block_range: true, 
        burn_volume: true, 
        date: true, 
        gs_chain: true, 
        gs_gid: true, 
        id: true, 
        largest_transfer: true, 
        mint_volume: true, 
        transfer_count: true, 
        unique_minters: false, 
        vid: true, 
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