import { SalesOrderHeader, SalesOrderHeaders } from "@models/sales";
import { CreationValidationResult, SalesOrderHeaderController } from "./protocols";
import { SalesOrderHeaderService } from "srv/services/sales-order-header/protocols";

export class SalesOrderHeaderControllerImpl implements SalesOrderHeaderController {
    constructor(private readonly service: SalesOrderHeaderService) { }

    public async beforeCreate(params: SalesOrderHeader): Promise<CreationValidationResult> {
        return this.service.beforeCreate(params);
    }

    public async afterCreate(params: SalesOrderHeaders, loggedUser: any): Promise<void> {
        return this.service.afterCreate(params, loggedUser);
    }

}