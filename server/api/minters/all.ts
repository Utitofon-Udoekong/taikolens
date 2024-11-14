import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limit = Number(query.limit) || 30

  try {
    const minters = await prisma.taiko_minter.findMany({
      orderBy: {
        minted_amount: 'desc',
      },
      take: limit,
      select: {
        add_transaction_hash: true,
        added_at: true,
        address: true,
        block_range: true,
        id: true,
        vid: true,
        is_active: true,
        minted_amount: true,
        mint_count: true,
        remove_transaction_hash: true,
        removed_at: true,
        token: true
      }
    })
    console.log('minters',jsonFormat(minters))
    return jsonFormat(minters)
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Failed to fetch active minters'
    })
  }
}) 