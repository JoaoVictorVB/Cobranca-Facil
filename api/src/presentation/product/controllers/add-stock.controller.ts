import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddStockUseCase } from '../../../application/product/use-cases/add-stock.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';
import { ProductResponseDto } from '../dtos/product-response.dto';
import { AdjustStockDto } from '../dtos/stock.dto';

@ApiTags(SWAGGER_TAGS.PRODUCTS)
@Controller('products')
@UseGuards(JwtAuthGuard)
export class AddStockController {
  constructor(private readonly addStockUseCase: AddStockUseCase) {}

  @Post(':id/stock/add')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add stock to a product' })
  @ApiOkResponse({ description: 'Stock added successfully', type: ProductResponseDto })
  async handler(
    @Param('id') id: string,
    @Body() dto: AdjustStockDto,
    @User('id') userId: string,
  ): Promise<ProductResponseDto> {
    const product = await this.addStockUseCase.execute(
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
