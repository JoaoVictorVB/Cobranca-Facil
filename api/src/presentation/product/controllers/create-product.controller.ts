import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProductUseCase } from '../../../application/product/use-cases/create-product.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { CreateProductDto } from '../dtos/create-product.dto';
import { ProductResponseDto } from '../dtos/product-response.dto';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';

@ApiTags(SWAGGER_TAGS.PRODUCTS)
@Controller('products')
@UseGuards(JwtAuthGuard)
export class CreateProductController {
  constructor(private readonly createProductUseCase: CreateProductUseCase) {}

  @Post()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar novo produto' })
  @ApiCreatedResponse({ description: 'Produto criado com sucesso', type: ProductResponseDto })
  async handler(
    @Body() createProductDto: CreateProductDto,
    @User('id') userId: string,
  ): Promise<ProductResponseDto> {
    const product = await this.createProductUseCase.execute(createProductDto, userId);
    return ProductResponseDto.fromDomain(product);
  }
}
