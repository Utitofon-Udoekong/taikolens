export interface TokenMetrics {
  symbol: string
  name: string
  decimals: number
  total_supply: Decimal
  transfer_count: Decimal
  holder_count: Decimal
  last_update_timestamp: Decimal
  owner: Bytes
}

export interface DailyMetric {
  date: string
  transfer_count: Decimal
  active_users: Decimal
  volume: Decimal
  mint_volume: Decimal
  burn_volume: Decimal
  average_transfer_value: Decimal
  largest_transfer: Decimal
  unique_minters: Decimal
}

export interface Minter {
  address: Bytes
  token: Bytes
  added_at: Decimal
  removed_at: Decimal | null
  is_active: boolean
  minted_amount: Decimal
  mint_count: Decimal
  add_transaction_hash: Bytes
  remove_transaction_hash: Bytes | null
}

export interface Transfer {
  from: Bytes
  to: Bytes
  value: Decimal
  block_number: Decimal
  block_timestamp: Decimal
  transaction_hash: Bytes
  is_mint: boolean
  is_burn: boolean
} 