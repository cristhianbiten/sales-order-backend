import { User } from '@sap/cds';

import { CustomerModel } from 'srv/models/customer';
import { CustomerRepository } from '../../repositories/customer/protocols';
import { LoggedUserModel } from 'srv/models/logged-user';
import { ProductModel } from 'srv/models/product';
import { ProductRepository } from '../../repositories/product/protocols';
import { SalesOrderHeaderModel } from 'srv/models/sales-order-header';
import { SalesOrderItemModel } from 'srv/models/sales-order-item';
import { SalesOrderLogModel } from 'srv/models/sales-order-log';
import { SalesOrderLogRepository } from 'srv/repositories/sales-order-log/protocols';
import { CreationValidationResult, SalesOrderHeaderService } from './protocols';
import { SalesOrderHeader, SalesOrderHeaders, SalesOrderItem } from '@models/sales';

export class SalesOrderHeaderServiceImpl implements SalesOrderHeaderService {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly customerRepository: CustomerRepository,
        private readonly salesOrderLogRepository: SalesOrderLogRepository
    ) {}

    public async beforeCreate(params: SalesOrderHeader): Promise<CreationValidationResult> {
        const products = await this.getproductsByIds(params);
        if (!products || products.length === 0) {
            return {
                hasErrors: true,
                error: new Error('Nenhum produto da lista de itens foi encontrado.')
            };
        }

        const items = this.getSalesOrderItems(params, products);
        const header = this.getSalesOrderHeader(params, items);
        const customer = await this.getCustomerById(params);
        if (!customer) {
            return {
                hasErrors: true,
                error: new Error('Customer não encontrado')
            };
        }

        const validationResult = header.validateCreationPayload({ customer_id: customer.id });
        if (validationResult.hasErrors) {
            return validationResult;
        }

        return {
            hasErrors: false,
            totalAmount: header.calculateDiscount()
        };
    }

    public async afterCreate(params: SalesOrderHeaders, loggedUser: User): Promise<void> {
        const headerAsArray = Array.isArray(params) ? params : ([params] as SalesOrderHeader[]);
        const logs: SalesOrderLogModel[] = [];
        for (const header of headerAsArray) {
            const products = (await this.getproductsByIds(header)) as ProductModel[];
            const items = this.getSalesOrderItems(header, products);
            const salesOrderHeader = this.getExistingSalesOrderHeader(header, items);
            const productsData = salesOrderHeader.getProductsData();
            for (const product of products) {
                const foundProduct = productsData.find((productData) => productData.id === product.id);
                product.sell(foundProduct?.quantity as number);
                await this.productRepository.updateStock(product);
            }
            const user = this.getLoggedUser(loggedUser);
            const log = this.getSalesOrderLog(salesOrderHeader, user);
            logs.push(log);
        }
        await this.salesOrderLogRepository.create(logs);
    }

    private async getproductsByIds(params: SalesOrderHeader): Promise<ProductModel[] | null> {
        const productsId = params.items?.map((item: SalesOrderItem) => item.product_id) as string[];
        return this.productRepository.findByIds(productsId);
    }

    private getSalesOrderItems(params: SalesOrderHeader, products: ProductModel[]): SalesOrderItemModel[] {
        return params.items?.map((item) =>
            SalesOrderItemModel.create({
                price: item.price as number,
                productId: item.product_id as string,
                quantity: item.quantity as number,
                products: products
            })
        ) as SalesOrderItemModel[];
    }

    private getSalesOrderHeader(params: SalesOrderHeader, items: SalesOrderItemModel[]): SalesOrderHeaderModel {
        return SalesOrderHeaderModel.create({
            customerId: params.customer_id as string,
            items: items
        });
    }

    private getExistingSalesOrderHeader(params: SalesOrderHeader, items: SalesOrderItemModel[]): SalesOrderHeaderModel {
        return SalesOrderHeaderModel.with({
            id: params.id as string,
            customerId: params.customer_id as string,
            totalAmount: params.totalAmount as number,
            items: items
        });
    }

    private getCustomerById(params: SalesOrderHeader): Promise<CustomerModel | null> {
        const customerId = params.customer_id as string;
        return this.customerRepository.findById(customerId);
    }

    private getLoggedUser(loggedUser: User): LoggedUserModel {
        return LoggedUserModel.create({
            id: loggedUser.id,
            roles: loggedUser.roles as string[],
            attributes: {
                id: loggedUser.attr.id as unknown as number,
                groups: loggedUser.attr.groups as unknown as string[]
            }
        });
    }

    private getSalesOrderLog(salesOrderHeader: SalesOrderHeaderModel, user: LoggedUserModel): SalesOrderLogModel {
        return SalesOrderLogModel.create({
            headerId: salesOrderHeader.id,
            userData: salesOrderHeader.toStringifiedObject(),
            orderData: user.toStringifiedObject()
        });
    }
}
