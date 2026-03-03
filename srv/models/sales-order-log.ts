type SalesOrderLogProps = {
    id: string;
    headerId: string;
    userData: string;
    orderData: string;
}

type SalesOrderLogWithoutIdProps = Omit<SalesOrderLogProps, 'id'>;

type SalesOrderLogDbProps = Omit<SalesOrderLogProps, 'headerId'> & { header_id: string };

export class SalesOrderLogModel {
    constructor(private props: SalesOrderLogProps) { }

    public static create(props: SalesOrderLogWithoutIdProps): SalesOrderLogModel {
        const id = crypto.randomUUID();
        return new SalesOrderLogModel({
            ...props,
            id,
        });
    }

    public get id(): string {
        return this.props.id;
    }

    public get headerId(): string {
        return this.props.headerId;
    }

    public get userData(): string {
        return this.props.userData;
    }

    public get orderData(): string {
        return this.props.orderData;
    }

    public toObject(): SalesOrderLogDbProps {
        return {
            id: this.id,
            header_id: this.headerId,
            userData: this.userData,
            orderData: this.orderData,
        }
    }

}