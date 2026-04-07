type SalesReportProps = {
    salesOrderId: string;
    salesOrderTotalAmount: number;
    customerId: string;
    customerFullName: string;
};

export class SalesReportModel {
    constructor(private props: SalesReportProps) {}

    public static with(props: SalesReportProps): SalesReportModel {
        return new SalesReportModel(props);
    }

    public get salesOrderId(): string {
        return this.props.salesOrderId;
    }

    public get salesOrderTotalAmount(): number {
        return this.props.salesOrderTotalAmount;
    }

    public get customerId(): string {
        return this.props.customerId;
    }

    public get customerFullName(): string {
        return this.props.customerFullName;
    }

    public toObject(): SalesReportProps {
        return {
            salesOrderId: this.props.salesOrderId,
            salesOrderTotalAmount: this.props.salesOrderTotalAmount,
            customerId: this.props.customerId,
            customerFullName: this.props.customerFullName
        };
    }
}
