import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateProductUseCase } from '../../../application/product/use-cases/update-product.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { ProductResponseDto } from '../dtos/product-response.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';

@ApiTags(SWAGGER_TAGS.PRODUCTS)
@Controller('products')
@UseGuards(JwtAuthGuard)
export class UpdateProductController {
  constructor(private readonly updateProductUseCase: UpdateProductUseCase) {}

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar produto' })
  @ApiOkResponse({ description: 'Produto atualizado com sucesso', type: ProductResponseDto })
  async handler(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @User('id') userId: string,
  ): Promise<ProductResponseDto> {
    const product = await this.updateProductUseCase.execute(
      {
        id,
        ...updateProductDto,
      },
      userId,
    );
    return ProductResponseDto.fromDomain(product);
  }
}
