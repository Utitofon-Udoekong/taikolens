import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limit = Number(query.limit) || 10

  try {
    const transfers = await prisma.taiko_transfer.findMany({
      take: limit,
      orderBy: {
        block_timestamp: 'desc'
      }
    })
    
    return transfers
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Failed to fetch recent transfers'
    })
  }
}) 