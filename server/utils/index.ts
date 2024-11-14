export const jsonFormat = (param: any): any => {
    return JSON.parse(JSON.stringify(
        param,
        (_, value) => (typeof value === "bigint" ? value.toString() : value)
    ));
};
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