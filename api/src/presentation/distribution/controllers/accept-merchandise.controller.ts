import { Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AcceptMerchandiseUseCase } from '../../../application/distribution/use-cases/accept-merchandise.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { StockTransferResponseDto } from '../dto/stock-transfer.response.dto';

@ApiTags('Distribution')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('distribution/merchandise')
export class AcceptMerchandiseController {
  constructor(private readonly acceptMerchandiseUseCase: AcceptMerchandiseUseCase) {}

  @Patch(':transferId/accept')
  @ApiOperation({ summary: 'Accept merchandise transfer' })
  async handle(
    @Param('transferId') transferId: string,
    @User('id') resellerId: string,
  ): Promise<StockTransferResponseDto> {
    const transfer = await this.acceptMerchandiseUseCase.execute(transferId, resellerId);
    return StockTransferResponseDto.fromDomain(transfer);
  }
}
