import { transports, createLogger, format } from "winston";


export const errorLogger = createLogger({
    level: 'info',
    format: format.simple(),
    transports: [new transports.File({ filename: './logs/errors.log' })]
});


export const transactionLogger = createLogger({
    level: 'info',
    format: format.simple(),
    transports: [new transports.File({ filename: './logs/transactions.log' })]
});