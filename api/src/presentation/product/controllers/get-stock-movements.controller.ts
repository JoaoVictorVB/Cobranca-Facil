import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetStockMovementsUseCase } from '../../../application/product/use-cases/get-stock-movements.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';
import { StockMovementResponseDto } from '../dtos/stock-movement-response.dto';

@ApiTags(SWAGGER_TAGS.PRODUCTS)
@Controller('products')
@UseGuards(JwtAuthGuard)
export class GetStockMovementsController {
  constructor(private readonly getStockMovementsUseCase: GetStockMovementsUseCase) {}

  @Get(':id/stock/movements')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get stock movements history for a product' })
  @ApiOkResponse({ description: 'Stock movements retrieved', type: [StockMovementResponseDto] })
  async handler(
    @Param('id') id: string,
    @User('id') userId: string,
  ): Promise<StockMovementResponseDto[]> {
    const movements = await this.getStockMovementsUseCase.execute(id, userId);
    return movements.map((movement) => StockMovementResponseDto.fromDomain(movement));
  }
}
