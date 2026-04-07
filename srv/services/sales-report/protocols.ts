import { ExpectedResult as SalesReportByDays } from '@models/db/types/SalesReport';

export interface SalesReportService {
    findByDays(days: number): Promise<SalesReportByDays[]>;
}
