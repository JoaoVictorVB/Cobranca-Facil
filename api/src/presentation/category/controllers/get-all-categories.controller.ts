import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';
import { FindAllCategoriesUseCase } from '../../../application/category/use-cases/find-all-categories.use-case';
import { CategoryResponseDto } from '../dto/category-response.dto';

@ApiTags(SWAGGER_TAGS.CATEGORIES)
@Controller('categories')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GetAllCategoriesController {
  constructor(private findAllCategoriesUseCase: FindAllCategoriesUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as categorias e subcategorias' })
  async handle(@User('id') userId: string): Promise<CategoryResponseDto[]> {
    const categories = await this.findAllCategoriesUseCase.execute(userId);
    return categories.map((cat) => CategoryResponseDto.fromDomain(cat));
  }
}
