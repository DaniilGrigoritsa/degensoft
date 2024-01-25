import { TransactionConfig } from "../../types";


export abstract class Exchange {
    abstract generateTransaction(amountIn: string, privateKey: string): Promise<TransactionConfig>;
}