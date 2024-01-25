import Web3 from "web3";
import { Exchange } from "../abstract";
import { HexString, TransactionConfig } from "../../types";


export class SyncSwap implements Exchange {
    private web3: Web3;
    private tokenIn: string;
    private tokenOut: string;
    private chainId: number;


    constructor(
        chainId: number,
        tokenIn: string,
        tokenOut: string,
        web3: Web3
    ) {
        this.chainId = chainId;
        this.tokenIn = tokenIn;
        this.tokenOut = tokenOut;
        this.web3 = web3;
    }


    private getGasPrice = async (): Promise<string> => {
        return await this.web3.eth.getGasPrice();
    }


    generateTransaction = async (amountIn: string, privateKey: string): Promise<TransactionConfig> => {
        
        
        return {
            from: "0x",
            to: "0x",
            gas: "",
            gasPrice: await this.getGasPrice(),
            data: "0x",
            chainId: this.chainId
        };
    }
}