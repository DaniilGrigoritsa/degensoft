import fs from "fs";
import path from "path";
import Web3 from "web3";
import { Sushi } from "./dex/sushi";
import { SyncSwap } from "./dex/syncswap";
import { Exchange } from "./dex/abstract";
import { config, providers, tokens } from "./config";
import { errorLogger, transactionLogger } from "./logging";
import { randomValueInterval, randomTimeInterval, shuffleArray } from "./utils";


const keys = fs.readFileSync(path.join(__dirname, "..", "wallets.txt"), "utf-8");
let privateKeys = keys.split("\r\n").filter((key) => key.length === 64);

if (config.shuffleKeys)
    privateKeys = shuffleArray<string>(privateKeys);

const httpProvider = providers[config.chainId];
const web3 = new Web3(new Web3.providers.HttpProvider(httpProvider));


const generateAmountIn = (decimals: number): string => {
    const value = randomValueInterval(config.amountInMin, config.amountInMax);
    return (value * 10 ** decimals).toFixed();
}

const interval = (): void => {
    const intervalSec = randomTimeInterval(config.intervalSecMin, config.intervalSecMax);
    setTimeout(() => {}, intervalSec * 1000);
}


(async () => {
    let exchange: Exchange;

    const chainId = config.chainId;
    const tokenIn = tokens[chainId][config.tokenIn];
    const tokenOut = tokens[chainId][config.tokenOut];

    if (config.exchangeName === "sushi")
        exchange = new Sushi(chainId, tokenIn.address, tokenOut.address, web3);
    else 
    if (config.exchangeName === "syncswap") 
        exchange = new SyncSwap(chainId, tokenIn.address, tokenOut.address, web3);
    else throw new Error("Unknown exchange name");
    
    privateKeys.forEach(async (privateKey) => {
        try {
            const amountIn = generateAmountIn(tokenIn.decimals);

            const transaction = await exchange.generateTransaction(amountIn, privateKey);
            
            const signedTransaction = await web3.eth.accounts.signTransaction(transaction, privateKey);

            const rawTransaction = signedTransaction.rawTransaction;
            
            if (rawTransaction)
                web3.eth.sendSignedTransaction(rawTransaction, (error, hash) => {
                    if (error) {
                        errorLogger.error(error.message);
                    }
                    else {
                        const amount = (Number(amountIn) / 10 ** tokenIn.decimals).toFixed(5);
                        const message = `${tokenIn.symbol} -> ${tokenOut.symbol} amount: ${amount} wallet: ${transaction.from} hash: ${hash}`;
                        transactionLogger.info(message);
                    }
                });
        }
        catch (error) {
            errorLogger.error((error as Error).message);
        }
        
        interval();
    });
})();
