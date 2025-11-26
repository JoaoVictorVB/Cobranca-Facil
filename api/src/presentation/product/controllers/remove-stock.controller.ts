import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RemoveStockUseCase } from '../../../application/product/use-cases/remove-stock.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';
import { ProductResponseDto } from '../dtos/product-response.dto';
import { AdjustStockDto } from '../dtos/stock.dto';

@ApiTags(SWAGGER_TAGS.PRODUCTS)
@Controller('products')
@UseGuards(JwtAuthGuard)
export class RemoveStockController {
  constructor(private readonly removeStockUseCase: RemoveStockUseCase) {}

  @Post(':id/stock/remove')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove stock from a product' })
  @ApiOkResponse({ description: 'Stock removed successfully', type: ProductResponseDto })
  async handler(
    @Param('id') id: string,
    @Body() dto: AdjustStockDto,
    @User('id') userId: string,
  ): Promise<ProductResponseDto> {
    const product = await this.removeStockUseCase.execute(
      {
        productId: id,
        quantity: dto.quantity,
        reason: dto.reason,
        reference: dto.reference,
      },
      userId,
    );
    return ProductResponseDto.fromDomain(product);
  }
}
