export const formatGas = (gas: string) => {
    return parseInt(gas).toLocaleString()
}

export const formatTime = (timestamp: string) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleString()
}

export const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value)
}

export const formatNumber = (value: string) => {
    return parseInt(value).toLocaleString()
}

export const formatEther = (value: string) => {
    return (parseInt(value) / 1e18).toFixed(2)
}

export const formatGwei = (value: string) => {
    return (parseInt(value) / 1e9).toFixed(2)
}


export const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 2
    }).format(amount)
}

export const formatDate = (timestamp: string | number | Date) => {
    return new Date(timestamp).toLocaleString()
}
export const truncateHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`
}

export const getArray = (buffer: any) => {
    if (!buffer) return ''
    if (buffer.type === 'Buffer') {
        return '0x' + buffer.data.map((x: number) => x.toString(16).padStart(2, '0')).join('')
    }
    return ''
}

export interface BlockReward {
    blockNumber: string;
    timeStamp: string;
    blockReward: string;
}

export interface TokenLoader {
    token: boolean;
    daily: boolean;
    hourly: boolean;
    transfers: boolean;
    accounts: boolean;
    blockRewards: boolean;
    ethPrice: boolean;
    ethSupply: boolean;
}

export interface EthPrice {
    ethbtc: string;
    ethbtc_timestamp: string;
    ethusd: string;
    ethusd_timestamp: string;
}

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
    volume: number
    mint_volume: number
    burn_volume: number
    average_transfer_value: number
    largest_transfer: number
    gs_chain: string,
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
    gs_chain: string,
}

export interface Account {
    balance: number;
    block_range: string;
    id: Buffer;
    last_transaction_timestamp: number;
    is_minter: boolean;
    gs_chain: string
}

export interface Transfer {
    block_number: number;
    block_range: string;
    block_timestamp: number;
    from: Buffer;
    id: Buffer;
    is_burn: boolean;
    is_mint: boolean;
    to: Buffer;
    transaction_hash: Buffer;
    value: number;
    gs_chain: string;
}
