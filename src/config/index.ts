import { Config, ChainId, Token, TokenName } from "../types";


export const config: Config = {
    chainId: 8453, // Base chain id
    intervalSecMin: 1, // from 1 second 
    intervalSecMax: 5, // to 5 seconds
    exchangeName: "sushi",
    tokenIn: "ETH", // "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    tokenOut: "axlUSDC", // "0xEB466342C4d449BC9f53A865D5Cb90586f405215",
    amountInMin: 0.001, // 0.001 ETH
    amountInMax: 0.1, // 0.1 ETH
    shuffleKeys: true // change private keys order
}

export const providers: Record<ChainId, string> = {
    // 324: "https://mainnet.era.zksync.io",
    8453: "https://mainnet.base.org",
    // 59144: "https://linea.decubate.com",
    // 534352: "https://rpc.ankr.com/scroll"
}

export const tokens: Record<ChainId, Record<TokenName, Token>> = {
    8453: {
        "ETH": {
            chainId: 8453,
            isNative: true,
            decimals: 18,
            address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
            symbol: "ETH"
        },
        "axlUSDC": {
            chainId: 8453,
            isNative: false,
            decimals: 6,
            address: "0xEB466342C4d449BC9f53A865D5Cb90586f405215",
            symbol: "axlUSDC"
        }
    }
}