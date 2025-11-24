import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindTransfersBySupplierUseCase } from '../../../application/distribution/use-cases/find-transfers-by-supplier.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { StockTransferResponseDto } from '../dto/stock-transfer.response.dto';

@ApiTags('Distribution')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('distribution/transfers')
export class FindTransfersController {
  constructor(private readonly findTransfersUseCase: FindTransfersBySupplierUseCase) {}

  @Get()
  @ApiOperation({ summary: 'List my transfers' })
  async handle(@User('id') supplierId: string): Promise<StockTransferResponseDto[]> {
    const transfers = await this.findTransfersUseCase.execute(supplierId);
    return transfers.map((t) => StockTransferResponseDto.fromDomain(t));
  }
}
