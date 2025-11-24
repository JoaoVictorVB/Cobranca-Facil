import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';
import { DeleteCategoryUseCase } from '../../../application/category/use-cases/delete-category.use-case';

@ApiTags(SWAGGER_TAGS.CATEGORIES)
@Controller('categories')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DeleteCategoryController {
  constructor(private deleteCategoryUseCase: DeleteCategoryUseCase) {}

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir categoria' })
  async handle(
    @Param('id') id: string,
    @User('id') userId: string,
  ): Promise<void> {
    await this.deleteCategoryUseCase.execute(id, userId);
  }
}
