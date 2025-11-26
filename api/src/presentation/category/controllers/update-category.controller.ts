import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';
import { UpdateCategoryUseCase } from '../../../application/category/use-cases/update-category.use-case';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CategoryResponseDto } from '../dto/category-response.dto';

@ApiTags(SWAGGER_TAGS.CATEGORIES)
@Controller('categories')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UpdateCategoryController {
  constructor(private updateCategoryUseCase: UpdateCategoryUseCase) {}

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar categoria' })
  async handle(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
    @User('id') userId: string,
  ): Promise<CategoryResponseDto> {
    const category = await this.updateCategoryUseCase.execute({ id, ...dto }, userId);
    return CategoryResponseDto.fromDomain(category);
  }
}
