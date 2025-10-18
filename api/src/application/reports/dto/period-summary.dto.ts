export interface PeriodSummaryDto {
  startDate: string;
  endDate: string;
  totalExpected: number;
  totalReceived: number;
  totalPending: number;
  totalOverdue: number;
  receivedPercentage: number;
  installmentsCount: number;
  paidCount: number;
  pendingCount: number;
  overdueCount: number;
}

export interface MonthComparisonDto {
  months: {
    month: string;
    totalExpected: number;
    totalReceived: number;
    totalPending: number;
    totalOverdue: number;
    receivedPercentage: number;
  }[];
}
