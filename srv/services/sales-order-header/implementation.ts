import { SalesOrderHeader, SalesOrderItem } from "@models/sales";
import { SalesOrderHeaderModel } from "srv/models/sales-order-header";
import { ProductRepository } from "../../repositories/product/protocols";
import { SalesOrderItemModel } from "srv/models/sales-order-item";
import { CustomerRepository } from "../../repositories/customer/protocols";
import { CreationValidationResult, SalesOrderHeaderService } from "./protocols";
import { ProductModel } from "srv/models/product";
import { CustomerModel } from "srv/models/customer";

export class SalesOrderHeaderServiceImpl implements SalesOrderHeaderService{
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly customerRepository: CustomerRepository
    ) { }

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
                error: new Error('Customer não encontrado'),
            };
        }

        const validationResult = header.validateCreationPayload({ customer_id: customer.id });
        if (validationResult.hasErrors) {
            return validationResult;
        }

        return {
            hasErrors: false,
            totalAmount: header.calculateDiscount(),
        }
    }

    private async getproductsByIds(params: SalesOrderHeader): Promise<ProductModel[] | null> {
        const productsId = params.items?.map((item: SalesOrderItem) => item.product_id) as string[];
        return this.productRepository.findByIds(productsId);
    }

    private getSalesOrderItems(params: SalesOrderHeader, products: ProductModel[]): SalesOrderItemModel[] {
        return params.items?.map(item => SalesOrderItemModel.create({
            price: item.price as number,
            productId: item.product_id as string,
            quantity: item.quantity as number,
            products: products,
        })) as SalesOrderItemModel[];
    }

    private getSalesOrderHeader(params: SalesOrderHeader, items: SalesOrderItemModel[]): SalesOrderHeaderModel {
        return SalesOrderHeaderModel.create({
            customerId: params.customer_id as string,
            items: items,
        });
    }

    private getCustomerById(params: SalesOrderHeader): Promise<CustomerModel | null> {
        const customerId = params.customer_id as string;
        return this.customerRepository.findById(customerId);
    }

}