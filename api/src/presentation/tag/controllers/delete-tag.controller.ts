import {
    Controller,
    Delete,
    HttpCode,
    HttpStatus,
    Param,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { DeleteTagUseCase } from '../../../application/tag/use-cases/delete-tag.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';

@ApiTags(SWAGGER_TAGS.TAGS)
@Controller('tags')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DeleteTagController {
  constructor(private readonly deleteTagUseCase: DeleteTagUseCase) {}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'id', description: 'ID da tag' })
  @ApiOperation({ summary: 'Excluir tag' })
  @ApiResponse({ status: 204, description: 'Tag excluída com sucesso' })
  @ApiResponse({ status: 404, description: 'Tag não encontrada' })
  async delete(
    @Param('id') id: string,
    @User('id') userId: string,
  ): Promise<void> {
    await this.deleteTagUseCase.execute(id, userId);
  }
}
