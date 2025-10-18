import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateSaleUseCase } from '../../application/sale/use-cases/create-sale.use-case';
import { GetOverdueInstallmentsUseCase } from '../../application/sale/use-cases/get-overdue-installments.use-case';
import { GetUpcomingInstallmentsUseCase } from '../../application/sale/use-cases/get-upcoming-installments.use-case';
import { PayInstallmentUseCase } from '../../application/sale/use-cases/pay-installment.use-case';
import { CreateSaleRequestDto } from './dto/create-sale.request.dto';
import { InstallmentResponseDto } from './dto/installment.response.dto';
import { PayInstallmentRequestDto } from './dto/pay-installment.request.dto';
import { SaleResponseDto } from './dto/sale.response.dto';

@ApiTags('sales')
@Controller('sales')
export class SaleController {
  constructor(
    private readonly createSaleUseCase: CreateSaleUseCase,
    private readonly payInstallmentUseCase: PayInstallmentUseCase,
    private readonly getUpcomingInstallmentsUseCase: GetUpcomingInstallmentsUseCase,
    private readonly getOverdueInstallmentsUseCase: GetOverdueInstallmentsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new sale' })
  @ApiResponse({ status: 201, description: 'Sale created successfully', type: SaleResponseDto })
  async create(@Body() dto: CreateSaleRequestDto): Promise<SaleResponseDto> {
    const sale = await this.createSaleUseCase.execute({
      ...dto,
      firstDueDate: new Date(dto.firstDueDate),
      saleDate: dto.saleDate ? new Date(dto.saleDate) : undefined,
    });
    return SaleResponseDto.fromDomain(sale);
  }

  @Put('installments/:id/pay')
  @ApiOperation({ summary: 'Pay an installment' })
  @ApiResponse({ status: 200, description: 'Installment paid successfully', type: InstallmentResponseDto })
  async payInstallment(
    @Param('id') id: string,
    @Body() dto: PayInstallmentRequestDto,
  ): Promise<InstallmentResponseDto> {
    const installment = await this.payInstallmentUseCase.execute({
      installmentId: id,
      amount: dto.amount,
      paidDate: dto.paidDate ? new Date(dto.paidDate) : undefined,
    });
    return InstallmentResponseDto.fromDomain(installment);
  }

  @Get('installments/upcoming')
  @ApiOperation({ summary: 'Get upcoming installments' })
  @ApiResponse({ status: 200, description: 'List of upcoming installments', type: [InstallmentResponseDto] })
  async getUpcoming(@Query('days') days?: number): Promise<InstallmentResponseDto[]> {
    const installments = await this.getUpcomingInstallmentsUseCase.execute({ days });
    return installments.map((installment) => InstallmentResponseDto.fromDomain(installment));
  }

  @Get('installments/overdue')
  @ApiOperation({ summary: 'Get overdue installments' })
  @ApiResponse({ status: 200, description: 'List of overdue installments', type: [InstallmentResponseDto] })
  async getOverdue(): Promise<InstallmentResponseDto[]> {
    const installments = await this.getOverdueInstallmentsUseCase.execute();
    return installments.map((installment) => InstallmentResponseDto.fromDomain(installment));
  }
}
