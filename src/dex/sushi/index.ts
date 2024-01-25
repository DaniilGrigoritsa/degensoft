import Web3 from "web3";
import { AbiItem } from 'web3-utils';
import { Exchange } from "../abstract";
import axios, { AxiosResponse } from "axios";
import { HexString, TransactionConfig } from "../../types";
import { sushiRouterAbi } from "../../interfaces/sushiRouterAbi";


type SushiApiResponse = {
    status: string
    routeProcessorAddr: HexString
    routeProcessorArgs: {
        tokenIn: HexString
        amountIn: string
        tokenOut: HexString
        amountOutMin: string
        to: HexString
        routeCode: HexString
        value: string
    }
}


export class Sushi implements Exchange {
    private web3: Web3;
    private tokenIn: string;
    private tokenOut: string;
    private chainId: number;
    private baseUrl = "https://production.sushi.com/swap/v3.2";


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


    private estimeteGas = async (transactionConfig: Omit<TransactionConfig, "gas">): Promise<string> => {
        const gas = await this.web3.eth.estimateGas(transactionConfig);
        return gas.toString();
    }


    generateTransaction = async (amountIn: string, privateKey: string): Promise<TransactionConfig> => {
        const maxPriceImpact = "0.005";

        const gasPrice = await this.getGasPrice();

        const account = this.web3.eth.accounts.privateKeyToAccount(privateKey);

        const params = new URLSearchParams({
            chainId: this.chainId.toString(),
            tokenIn: this.tokenIn,
            tokenOut: this.tokenOut,
            amount: amountIn,
            maxPriceImpact: maxPriceImpact,
            gasPrice: gasPrice,
            to: account.address,
            preferSushi: "true"
        });

        const response: AxiosResponse<SushiApiResponse> = await axios.get(
            `${this.baseUrl}?${params}`
        );

        const routeProcessor = response.data.routeProcessorAddr;
        const routeProcessorArgs = response.data.routeProcessorArgs;

        const router = new this.web3.eth.Contract(
            sushiRouterAbi as unknown as AbiItem,
            routeProcessor
        );

        const calldata = router.methods.processRoute(
            routeProcessorArgs.tokenIn,
            routeProcessorArgs.amountIn,
            routeProcessorArgs.tokenOut,
            routeProcessorArgs.amountOutMin,
            routeProcessorArgs.to,
            routeProcessorArgs.routeCode
        ).encodeABI() as HexString;

        const transactionConfig: Omit<TransactionConfig, "gas"> = {
            from: account.address as HexString,
            to: routeProcessor,
            gasPrice: gasPrice,
            data: calldata,
            value: routeProcessorArgs.value
        }

        const gas = await this.estimeteGas(transactionConfig);

        return {
            ...transactionConfig,
            gas: gas
        };
    }
}