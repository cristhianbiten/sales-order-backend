import { SalesOrderHeader } from "@models/sales";

export type CreationValidationResult = {
    hasErrors: boolean;
    error?: Error;
    totalAmount?: number;
};

export interface SalesOrderHeaderController {
    beforeCreate(params: SalesOrderHeader): Promise<CreationValidationResult>;
}