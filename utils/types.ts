export interface TokenMetric {
  symbol: string
  name: string
  decimals: number
  total_supply: number
  transfer_count: number
  holder_count: number
  last_update_timestamp: number
  owner: string
}

export interface DailyMetric {
  block_range: string
  id: Buffer
  date: string
  transfer_count: number
  active_users: number
  volume: number
  mint_volume: number
  burn_volume: number
  average_transfer_value: number
  largest_transfer: number
  unique_minters: number
}

export interface HourlyMetric {
  block_range: string
  id: Buffer
  transfer_count: number
  active_users: number
  volume: number
  mint_volume: number
  burn_volume: number
  average_transfer_value: number
  hour: string
}

export interface Minter {
  address: string
  token: string
  added_at: number
  removed_at: number | null
  is_active: boolean
  minted_amount: number
  mint_count: number
  add_transaction_hash: string
  remove_transaction_hash: string | null
}

export interface Transfer {
  from: string
  to: string
  value: number
  block_number: number
  block_timestamp: number
  transaction_hash: string
  is_mint: boolean
  is_burn: boolean
} 
