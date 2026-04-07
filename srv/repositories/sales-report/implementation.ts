import cds from '@sap/cds';

import { ExpectedResult as SalesReportByDays } from '@models/db/types/SalesReport';

import { SalesReportModel } from '@/models/sales-report';
import { SalesReportRepository } from '@/repositories/sales-report/protocols';

export class SalesReportRepositoryImpl implements SalesReportRepository {
    public async findByDays(days: number): Promise<SalesReportModel[] | null> {
        const today = new Date().toISOString();
        const subtratedDays = new Date();
        subtratedDays.setDate(subtratedDays.getDate() - days);
        const subtratedDaysISOString = subtratedDays.toISOString();

        const sql = SELECT.from('sales.SalesOrderHeaders')
            .columns(
                'id as salesOrderId',
                'totalAmount as salesOrderTotalAmount',
                'customer.id as customerId',
                // eslint-disable-next-line quotes
                `customer.firstName || ' ' || customer.lastName as customerFullName`
            )
            .where({ createdAt: { between: subtratedDaysISOString, and: today } });

        const salesReports = await cds.run(sql);
        if (salesReports.length === 0) {
            return null;
        }
        return salesReports.map((salesReport: SalesReportByDays) =>
            SalesReportModel.with({
                salesOrderId: salesReport.salesOrderId as string,
                salesOrderTotalAmount: salesReport.salesOrderTotalAmount as number,
                customerId: salesReport.customerId as string,
                customerFullName: salesReport.customerFullName as string
            })
        );
    }
}
