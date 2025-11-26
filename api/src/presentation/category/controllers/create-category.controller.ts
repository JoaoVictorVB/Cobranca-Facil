import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';
import { CreateCategoryUseCase } from '../../../application/category/use-cases/create-category.use-case';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { CategoryResponseDto } from '../dto/category-response.dto';

@ApiTags(SWAGGER_TAGS.CATEGORIES)
@Controller('categories')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CreateCategoryController {
  constructor(private createCategoryUseCase: CreateCategoryUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova categoria ou subcategoria' })
  async handle(
    @Body() dto: CreateCategoryDto,
    @User('id') userId: string,
  ): Promise<CategoryResponseDto> {
    const category = await this.createCategoryUseCase.execute(dto, userId);
    return CategoryResponseDto.fromDomain(category);
  }
}
