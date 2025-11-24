import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SendMerchandiseUseCase } from '../../../application/distribution/use-cases/send-merchandise.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { SendMerchandiseRequestDto } from '../dto/send-merchandise.request.dto';
import { StockTransferResponseDto } from '../dto/stock-transfer.response.dto';

@ApiTags('Distribution')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('distribution/merchandise')
export class SendMerchandiseController {
  constructor(private readonly sendMerchandiseUseCase: SendMerchandiseUseCase) {}

  @Post('send')
  @ApiOperation({ summary: 'Send merchandise to reseller' })
  async handle(
    @Body() dto: SendMerchandiseRequestDto,
    @User('id') supplierId: string,
  ): Promise<StockTransferResponseDto> {
    const transfer = await this.sendMerchandiseUseCase.execute(dto, supplierId);
    return StockTransferResponseDto.fromDomain(transfer);
  }
}
