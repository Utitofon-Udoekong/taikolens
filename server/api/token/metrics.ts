import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limit = Number(query.limit) || 30
  try {
    const token = await prisma.taiko_token.findFirst({
      take: limit,
      orderBy: {
        last_update_timestamp: 'desc'
      },
      select: {
        last_update_timestamp: true,
        decimals: true,
        holder_count: true,
        id: true,
        symbol: true,
        name: true,
        owner: true,
        total_supply: true,
        transfer_count: true,
        gs_chain: true,
      }
    })
    return jsonFormat(token)
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Failed to fetch token metrics'
    })
  }
}) 