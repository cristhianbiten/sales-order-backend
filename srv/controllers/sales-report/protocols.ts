import { ExpectedResult as SalesReportByDays } from '@models/db/types/SalesReport';

export interface SalesReportController {
    findByDays(days: number): Promise<SalesReportByDays[]>;
}
