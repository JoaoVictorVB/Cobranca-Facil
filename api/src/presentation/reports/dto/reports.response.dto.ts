import { ApiProperty } from '@nestjs/swagger';

export class MonthlySummaryResponseDto {
  @ApiProperty()
  month: string;

  @ApiProperty()
  totalExpected: number;

  @ApiProperty()
  totalReceived: number;

  @ApiProperty()
  totalPending: number;

  @ApiProperty()
  totalOverdue: number;

  @ApiProperty()
  receivedPercentage: number;

  @ApiProperty()
  upcomingInstallments: number;

  @ApiProperty()
  overdueInstallments: number;

  @ApiProperty()
  paidInstallments: number;
}

export class DailySalesResponseDto {
  @ApiProperty()
  date: string;

  @ApiProperty()
  totalSales: number;

  @ApiProperty()
  salesCount: number;
}

export class PaymentStatusResponseDto {
  @ApiProperty()
  status: string;

  @ApiProperty()
  count: number;

  @ApiProperty()
  totalAmount: number;
}

export class TopClientsResponseDto {
  @ApiProperty()
  clientId: string;

  @ApiProperty()
  clientName: string;

  @ApiProperty()
  totalPurchases: number;

  @ApiProperty()
  totalPaid: number;

  @ApiProperty()
  totalPending: number;
}

export class PeriodSummaryResponseDto {
  @ApiProperty()
  startDate: string;

  @ApiProperty()
  endDate: string;

  @ApiProperty()
  totalExpected: number;

  @ApiProperty()
  totalReceived: number;

  @ApiProperty()
  totalPending: number;

  @ApiProperty()
  totalOverdue: number;

  @ApiProperty()
  receivedPercentage: number;

  @ApiProperty()
  installmentsCount: number;

  @ApiProperty()
  paidCount: number;

  @ApiProperty()
  pendingCount: number;

  @ApiProperty()
  overdueCount: number;
}

export class MonthDataResponseDto {
  @ApiProperty()
  month: string;

  @ApiProperty()
  totalExpected: number;

  @ApiProperty()
  totalReceived: number;

  @ApiProperty()
  totalPending: number;

  @ApiProperty()
  totalOverdue: number;

  @ApiProperty()
  receivedPercentage: number;
}

export class MonthComparisonResponseDto {
  @ApiProperty({ type: [MonthDataResponseDto] })
  months: MonthDataResponseDto[];
}
