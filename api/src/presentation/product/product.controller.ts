import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import {
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { CreateProductUseCase } from '../../application/product/use-cases/create-product.use-case';
import { DeleteProductUseCase } from '../../application/product/use-cases/delete-product.use-case';
import { FindAllProductsUseCase } from '../../application/product/use-cases/find-all-products.use-case';
import { FindProductByIdUseCase } from '../../application/product/use-cases/find-product-by-id.use-case';
import { UpdateProductUseCase } from '../../application/product/use-cases/update-product.use-case';
import { CreateProductDto } from './dtos/create-product.dto';
import { ProductResponseDto } from './dtos/product-response.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly findAllProductsUseCase: FindAllProductsUseCase,
    private readonly findProductByIdUseCase: FindProductByIdUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo produto' })
  @ApiCreatedResponse({
    description: 'Produto criado com sucesso',
    type: ProductResponseDto,
  })
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.createProductUseCase.execute(createProductDto);
    return ProductResponseDto.fromDomain(product);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os produtos' })
  @ApiOkResponse({
    description: 'Lista de produtos',
    type: [ProductResponseDto],
  })
  async findAll(): Promise<ProductResponseDto[]> {
    const products = await this.findAllProductsUseCase.execute();
    return products.map(ProductResponseDto.fromDomain);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar produto por ID' })
  @ApiOkResponse({
    description: 'Produto encontrado',
    type: ProductResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<ProductResponseDto> {
    const product = await this.findProductByIdUseCase.execute(id);
    return ProductResponseDto.fromDomain(product);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar produto' })
  @ApiOkResponse({
    description: 'Produto atualizado com sucesso',
    type: ProductResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.updateProductUseCase.execute({
      id,
      ...updateProductDto,
    });
    return ProductResponseDto.fromDomain(product);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar produto' })
  @ApiNoContentResponse({ description: 'Produto deletado com sucesso' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteProductUseCase.execute(id);
  }
}
