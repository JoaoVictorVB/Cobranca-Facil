import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindLowStockProductsUseCase } from '../../../application/product/use-cases/find-low-stock-products.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';
import { ProductResponseDto } from '../dtos/product-response.dto';

@ApiTags(SWAGGER_TAGS.PRODUCTS)
@Controller('products')
@UseGuards(JwtAuthGuard)
export class GetLowStockProductsController {
  constructor(private readonly findLowStockProductsUseCase: FindLowStockProductsUseCase) {}

  @Get('low-stock')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get products with low stock' })
  @ApiOkResponse({ description: 'Low stock products retrieved', type: [ProductResponseDto] })
  async handler(@User('id') userId: string): Promise<ProductResponseDto[]> {
    const products = await this.findLowStockProductsUseCase.execute(userId);
    return products.map((product) => ProductResponseDto.fromDomain(product));
  }
}
