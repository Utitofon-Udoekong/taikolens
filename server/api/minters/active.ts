import prisma from '~/lib/prisma'

export default defineEventHandler(async () => {
  try {
    const minters = await prisma.taiko_minter.findMany({
      where: {
        is_active: true
      },
      orderBy: {
        minted_amount: 'desc'
      }
    })
    
    return minters
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Failed to fetch active minters'
    })
  }
}) 