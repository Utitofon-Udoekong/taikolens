import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const days = Number(query.days) || 30

  try {
    const metrics: DailyMetric[] = (await prisma.taiko_daily_metric.findMany({
      take: days,
      orderBy: {
        date: 'desc'
      },
      select: {
        id: true,
        date: true,
        transfer_count: true,
        volume: true,
        mint_volume: true,
        burn_volume: true,
        average_transfer_value: true,
        largest_transfer: true,
        gs_chain: true,
      }
    })).map(metric => ({
      ...metric,
      transfer_count: Number(metric.transfer_count),
      volume: Number(metric.volume),
      mint_volume: Number(metric.mint_volume),
      burn_volume: Number(metric.burn_volume),
      average_transfer_value: Number(metric.average_transfer_value),
      largest_transfer: Number(metric.largest_transfer),
    }))
    return jsonFormat(metrics)
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Failed to fetch daily metrics'
    })
  }
}) 