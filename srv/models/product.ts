export type ProductProps = {
    id: string;
    name: string;
    price: number;
    stock: number;
}

export type SellValidationResult = {
    hasErrors: boolean;
    error?: Error;
};

export class ProductModel {
    private constructor(private props: ProductProps) { }

    public static with(props: ProductProps): ProductModel {
        return new ProductModel(props);
    }

    public get id(): string {
        return this.props.id;
    }

    public get name(): string {
        return this.props.name;
    }

    public get price(): number {
        return this.props.price;
    }

    public get stock(): number {
        return this.props.stock;
    }

    public set stock(stock: number) {
        this.props.stock = stock;
    }

    public sell(quantity: number): SellValidationResult {
        if (this.stock < quantity) {
            return {
                hasErrors: true,
                error: new Error('Quantidade de produtos insuficiente no estoque')
            }
        }
        this.stock -= quantity;
        return {
            hasErrors: false
        }
    }

}