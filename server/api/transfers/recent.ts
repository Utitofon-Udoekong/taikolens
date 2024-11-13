import prisma from '~/lib/prisma'
import { json } from '~/utils/formatters'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limit = Number(query.limit) ?? 10
  // const page = Number(query.page) ?? null

  try {
    const transfers = await prisma.taiko_transfer.findMany({
      take: limit,
      orderBy: {
        block_timestamp: 'desc'
      },
      select: {
        block_number: true,
        block_range: true,
        block_timestamp: true,
        from: true,
        id: true,
        is_burn: true,
        is_mint: true,
        to: true,
        transaction_hash: true,
        value: true
      }
    })
    return json(transfers)
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Failed to fetch recent transfers'
    })
  }
}) 