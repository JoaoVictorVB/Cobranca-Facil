import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindAllProductsUseCase } from '../../../application/product/use-cases/find-all-products.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { ProductResponseDto } from '../dtos/product-response.dto';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';

@ApiTags(SWAGGER_TAGS.PRODUCTS)
@Controller('products')
@UseGuards(JwtAuthGuard)
export class GetAllProductsController {
  constructor(private readonly findAllProductsUseCase: FindAllProductsUseCase) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos os produtos' })
  @ApiOkResponse({ description: 'Lista de produtos', type: [ProductResponseDto] })
  async handler(@User('id') userId: string): Promise<ProductResponseDto[]> {
    const products = await this.findAllProductsUseCase.execute(userId);
    return products.map(ProductResponseDto.fromDomain);
  }
}
