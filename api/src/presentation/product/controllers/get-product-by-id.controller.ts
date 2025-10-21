import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindProductByIdUseCase } from '../../../application/product/use-cases/find-product-by-id.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { ProductResponseDto } from '../dtos/product-response.dto';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';

@ApiTags(SWAGGER_TAGS.PRODUCTS)
@Controller('products')
@UseGuards(JwtAuthGuard)
export class GetProductByIdController {
  constructor(private readonly findProductByIdUseCase: FindProductByIdUseCase) {}

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar produto por ID' })
  @ApiOkResponse({ description: 'Produto encontrado', type: ProductResponseDto })
  async handler(@Param('id') id: string, @User('id') userId: string): Promise<ProductResponseDto> {
    const product = await this.findProductByIdUseCase.execute(id, userId);
    return ProductResponseDto.fromDomain(product);
  }
}
