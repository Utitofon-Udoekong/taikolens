import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const days = Number(query.days) || 30

  try {
    const metrics = await prisma.taiko_daily_metric.findMany({
      take: days,
      orderBy: {
        date: 'desc'
      }
    })
    
    return metrics
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Failed to fetch daily metrics'
    })
  }
}) 