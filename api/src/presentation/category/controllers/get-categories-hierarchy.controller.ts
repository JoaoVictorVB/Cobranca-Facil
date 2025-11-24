import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';
import { FindCategoriesWithChildrenUseCase } from '../../../application/category/use-cases/find-categories-with-children.use-case';
import { CategoryResponseDto } from '../dto/category-response.dto';

@ApiTags(SWAGGER_TAGS.CATEGORIES)
@Controller('categories')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GetCategoriesHierarchyController {
  constructor(private findCategoriesWithChildrenUseCase: FindCategoriesWithChildrenUseCase) {}

  @Get('hierarchy')
  @ApiOperation({ summary: 'Listar categorias em estrutura hierárquica' })
  async handle(@User('id') userId: string): Promise<CategoryResponseDto[]> {
    const categories = await this.findCategoriesWithChildrenUseCase.execute(userId);
    return categories.map((cat) => CategoryResponseDto.fromDomain(cat));
  }
}
