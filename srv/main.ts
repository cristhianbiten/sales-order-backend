import cds, { Request, Service } from "@sap/cds";
import { Customers, Product, Products, SalesOrderHeaders, SalesOrderItem, SalesOrderItems } from "@models/sales";
import { customerController } from "./factories/controllers/customer";
import { FullRequestParams } from "./protocols";
import { salesOrderHeaderController } from "./factories/controllers/sales-order-header";

export default (service: Service) => {

    service.before('READ', '*', (request: Request) => {
        if (!request.user.is("read_only_user")) {
            return request.reject(403, 'Não autorizado');
        }
    });

    service.before(['WRITE', 'DELETE'], '*', (request: Request) => {
        if (!request.user.is("admin")) {
            return request.reject(403, 'Não autorizada a criação ou exclusão de dados');
        }
    });

    service.after('READ', 'Customers', (customersList: Customers, request) => {
        (request as unknown as FullRequestParams<Customers>).results = customerController.afterRead(customersList);
    });

    service.before('CREATE', 'SalesOrderHeaders', async (request: Request) => {

        const result = await salesOrderHeaderController.beforeCreate(request.data);
        if (result.hasErrors) {
            return request.reject(400, result.error?.message as string);
        }

        request.data.totalAmount = result.totalAmount;

    });

    service.after('CREATE', 'SalesOrderHeaders', async (salesOrderHeaders: SalesOrderHeaders, request: Request) => {
        await salesOrderHeaderController.afterCreate(salesOrderHeaders, request.user);
    });

};
