import { User } from '@sap/cds';
import { SalesOrderHeader, SalesOrderHeaders } from '@models/sales';


export type CreationValidationResult = {
    hasErrors: boolean;
    error?: Error;
    totalAmount?: number;
};

export interface SalesOrderHeaderService {
    beforeCreate(params: SalesOrderHeader): Promise<CreationValidationResult>;
    afterCreate(params: SalesOrderHeaders, loggedUser: User): Promise<void>;
}
