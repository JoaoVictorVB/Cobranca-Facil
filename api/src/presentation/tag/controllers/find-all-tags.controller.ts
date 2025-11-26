import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { FindAllTagsUseCase } from '../../../application/tag/use-cases/find-all-tags.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';
import { TagResponseDto } from '../dto/tag-response.dto';

@ApiTags(SWAGGER_TAGS.TAGS)
@Controller('tags')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FindAllTagsController {
  constructor(private readonly findAllTagsUseCase: FindAllTagsUseCase) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar todas as tags do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tags retornada com sucesso',
    type: [TagResponseDto],
  })
  async findAll(@User('id') userId: string): Promise<TagResponseDto[]> {
    const tags = await this.findAllTagsUseCase.execute(userId);
    return tags.map(TagResponseDto.fromDomain);
  }
}
