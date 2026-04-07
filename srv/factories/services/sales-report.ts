import { SalesReportRepositoryImpl } from '@/repositories/sales-report/implementation';
import { SalesReportService } from '@/services/sales-report/protocols';
import { SalesReportServiceImpl } from '@/services/sales-report/implementation';

const makeSalesReportService = (): SalesReportService => {
    const salesReportRepository = new SalesReportRepositoryImpl();
    return new SalesReportServiceImpl(salesReportRepository);
};

export const salesReportService = makeSalesReportService();
