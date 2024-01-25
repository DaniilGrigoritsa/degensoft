export type HexString = `0x${string}`;

export type ChainId = 8453;

export type TokenName = "ETH" | "axlUSDC";

export type Token = {
    chainId: number
    isNative: boolean
    decimals: number
    symbol: string
    address: HexString
}

export type TransactionConfig = {
    from: HexString,
    to: HexString,
    gas: string;
    gasPrice:  string
    data: HexString,
    value: string
}

export type ExchangeName = "sushi" | "syncswap"

export type Config = {
    chainId: ChainId
    intervalSecMin: number
    intervalSecMax: number
    exchangeName: ExchangeName
    tokenIn: TokenName
    tokenOut: TokenName
    amountInMin: number
    amountInMax: number
    shuffleKeys: boolean
}