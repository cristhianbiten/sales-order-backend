import { ExpectedResult as SalesReportByDays } from '@models/db/types/SalesReport';
import { SalesReportRepositoryImpl } from '@/repositories/sales-report/implementation';
import { SalesReportService } from '@/services/sales-report/protocols';

export class SalesReportServiceImpl implements SalesReportService {
    constructor(private readonly repository: SalesReportRepositoryImpl) {}

    public async findByDays(days = 7): Promise<SalesReportByDays[]> {
        const reportData = await this.repository.findByDays(days);
        if (!reportData) {
            return [];
        }
        return reportData?.map((r) => r.toObject());
    }
}
