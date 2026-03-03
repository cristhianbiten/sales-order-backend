import { SalesOrderHeader, SalesOrderHeaders } from "@models/sales";
import { User } from "@sap/cds";

export type CreationValidationResult = {
    hasErrors: boolean;
    error?: Error;
    totalAmount?: number;
};

export interface SalesOrderHeaderController {
    beforeCreate(params: SalesOrderHeader): Promise<CreationValidationResult>;
    afterCreate(params: SalesOrderHeaders, loggedUser: User ): Promise<void>;
}