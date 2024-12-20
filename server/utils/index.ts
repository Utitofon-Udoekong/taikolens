// Formats a parameter as JSON, converting BigInt values to strings to ensure compatibility with JSON.stringify.
export const jsonFormat = (param: any): any => {
    return JSON.parse(JSON.stringify(
        param,
        (_, value) => (typeof value === "bigint" ? value.toString() : value)
    ));
};

export interface TokenMetric {
    last_update_timestamp: string;
    decimals:              number;
    holder_count:          string;
    id:                    Buffer;
    symbol:                string;
    name:                  string;
    owner:                 Buffer;
    total_supply:          string;
    transfer_count:        string;
    gs_chain:              string;
}

export interface DailyMetric {
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
    id: Buffer;
    last_transaction_timestamp: number;
    is_minter: boolean;
    gs_chain: string
}

export interface Transfer {
    block_number: number;
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