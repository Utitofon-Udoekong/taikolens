
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const hours = Number(query.hours) || 24

  try {
    const metrics: HourlyMetric[] = (await prisma.taiko_hourly_metric.findMany({
      take: hours,
      orderBy: {
        hour: 'desc'
      },
      select: {
        id: true,
        hour: true,
        transfer_count: true,
        active_users: true,
        volume: true,
        mint_volume: true,
        burn_volume: true,
        average_transfer_value: true,
        gs_chain: true,
      }
    })).map(metric => ({
      ...metric,
      transfer_count: Number(metric.transfer_count),
      volume: Number(metric.volume),
      mint_volume: Number(metric.mint_volume),
      burn_volume: Number(metric.burn_volume),
      average_transfer_value: Number(metric.average_transfer_value),
      active_users: Number(metric.active_users),
    }))
    return jsonFormat(metrics)
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Failed to fetch daily metrics'
    })
  }
}) 