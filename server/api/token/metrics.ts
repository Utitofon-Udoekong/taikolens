import prisma from '~/lib/prisma'

export default defineEventHandler(async () => {
  try {
    const token = await prisma.taiko_token.findFirst({
      orderBy: {
        last_update_timestamp: 'desc'
      }
    })
    
    return token
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Failed to fetch token metrics'
    })
  }
}) 