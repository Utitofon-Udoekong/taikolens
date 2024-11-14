import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limit = Number(query.limit) || 30

  try {
    const accounts: Account[] = (await prisma.taiko_account.findMany({
      orderBy: {
        last_transaction_timestamp: 'desc',
      },
      take: limit,
      select: {
        balance: true,
        block_range: true,
        id: true,
        last_transaction_timestamp: true,
        is_minter: true,
        gs_chain: true,
      }
    })).map(account => ({
      ...account,
      balance: Number(account.balance),
      last_transaction_timestamp: Number(account.last_transaction_timestamp),
    }));
    return jsonFormat(accounts)
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Failed to fetch active accounts'
    })
  }
}) 