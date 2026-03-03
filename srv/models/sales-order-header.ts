import { SalesOrderItemModel } from "./sales-order-item";

type SalesOrderHeaderProps = {
    id: string;
    customerId: string;
    totalAmount: number;
    items: SalesOrderItemModel[];
};

type SalesOrderHeaderPropsWithoutIdAndTotalAmount = Omit<SalesOrderHeaderProps, 'id' | 'totalAmount'>;

type CreationPayload = {
    customer_id: SalesOrderHeaderProps['customerId'];
};

type CreationValidationResult = {
    hasErrors: boolean;
    error?: Error;
};

export class SalesOrderHeaderModel {
    constructor(private props: SalesOrderHeaderProps) { }

    public static create(props: SalesOrderHeaderPropsWithoutIdAndTotalAmount): SalesOrderHeaderModel {
        return new SalesOrderHeaderModel({
            ...props,
            id: crypto.randomUUID(),
            totalAmount: 0,
        });
    }

    public static with(props: SalesOrderHeaderProps): SalesOrderHeaderModel {
        return new SalesOrderHeaderModel(props);
    }


    public get id() {
        return this.props.id;
    }

    public get customerId() {
        return this.props.customerId;
    }

    public get totalAmount() {
        return this.props.totalAmount;
    }

    public get items() {
        return this.props.items;
    }

    public set totalAmount(totalAmount: number) {
        this.totalAmount = totalAmount;
    }

    public validateCreationPayload(params: CreationPayload): CreationValidationResult {
        const customerValidationResult = this.validateCustomerOnCreation(params.customer_id);
        if (customerValidationResult.hasErrors) {
            return customerValidationResult;
        }

        const itemsValidationResult = this.validateItemsOnCreation(this.props.items);
        if (itemsValidationResult.hasErrors) {
            return itemsValidationResult;
        }

        return {
            hasErrors: false,
        }
    }

    public calculateTotalAmount(): number {
        let totalAmount = 0;
        this.items.forEach(item => {
            totalAmount += (item.price as number) * (item.quantity as number);
        })
        return totalAmount;
    }

    public calculateDiscount(): number {
        let totalAmount = 0;
        totalAmount = this.calculateTotalAmount();
        if (totalAmount > 30000) {
            const discount = totalAmount * (10 / 100);
            totalAmount = totalAmount - discount;
        }
        return totalAmount;
    }

    public getProductsData(): { id: string; quantity: number }[] {
        return this.items.map(item => ({
            id: item.productId,
            quantity: item.quantity
        }));
    }

    public toStringifiedObject(): string {
        return JSON.stringify(this.props);
    }

    private validateCustomerOnCreation(customerId: CreationPayload['customer_id']): CreationValidationResult {
        if (!customerId) {
            return {
                hasErrors: true,
                error: new Error('Customer inválido')
            };
        }

        return {
            hasErrors: false,
        }
    }

    private validateItemsOnCreation(items: SalesOrderHeaderProps['items']): CreationValidationResult {
        if (!items || items?.length === 0) {
            return {
                hasErrors: true,
                error: new Error('Itens inválidos')
            };
        }

        const itemsErrors: string[] = [];
        items.forEach(item => {
            const validationResult = item.validateCreationPayload({ product_id: item.productId });
            if (validationResult.hasErrors) {
                itemsErrors.push(validationResult.error?.message as string);
            }
        });
        if (itemsErrors.length > 0) {
            const messages = itemsErrors.join('\n -');
            return {
                hasErrors: true,
                error: new Error(messages)
            };
        }

        return {
            hasErrors: false,
        }
    }

}