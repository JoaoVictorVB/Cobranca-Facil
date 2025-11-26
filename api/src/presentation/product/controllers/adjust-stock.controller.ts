import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdjustStockUseCase } from '../../../application/product/use-cases/adjust-stock.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';
import { ProductResponseDto } from '../dtos/product-response.dto';
import { StockAdjustmentDto } from '../dtos/stock.dto';

@ApiTags(SWAGGER_TAGS.PRODUCTS)
@Controller('products')
@UseGuards(JwtAuthGuard)
export class AdjustStockController {
  constructor(private readonly adjustStockUseCase: AdjustStockUseCase) {}

  @Put(':id/stock/adjust')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Adjust product stock to a specific quantity' })
  @ApiOkResponse({ description: 'Stock adjusted successfully', type: ProductResponseDto })
  async handler(
    @Param('id') id: string,
    @Body() dto: StockAdjustmentDto,
    @User('id') userId: string,
  ): Promise<ProductResponseDto> {
    const product = await this.adjustStockUseCase.execute(
      {
        productId: id,
        newQuantity: dto.newQuantity,
        reason: dto.reason,
      },
      userId,
    );
    return ProductResponseDto.fromDomain(product);
  }
}
