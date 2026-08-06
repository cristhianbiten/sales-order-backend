import { User } from '@sap/cds';

import { Payload as BulkCreateSalesOrderPayload } from '@models/db/types/BulkCreateSalesOrder';
import { SalesOrderHeader, SalesOrderHeaders } from '@models/sales';

export type CreationValidationResult = {
    hasErrors: boolean;
    error?: Error;
    totalAmount?: number;
};

export interface SalesOrderHeaderController {
    beforeCreate(params: SalesOrderHeader): Promise<CreationValidationResult>;
    afterCreate(params: SalesOrderHeaders, loggedUser: User): Promise<void>;
    bulkCreate(params: BulkCreateSalesOrderPayload[], loggedUser: User): Promise<CreationValidationResult>;
    cloneSalesOrder(id: string, loggedUser: User): Promise<CreationValidationResult>;
}
