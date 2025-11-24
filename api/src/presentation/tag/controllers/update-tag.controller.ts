import { Body, Controller, HttpCode, HttpStatus, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateTagUseCase } from '../../../application/tag/use-cases/update-tag.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';
import { TagResponseDto } from '../dto/tag-response.dto';
import { UpdateTagDto } from '../dto/update-tag.dto';

@ApiTags(SWAGGER_TAGS.TAGS)
@Controller('tags')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UpdateTagController {
  constructor(private readonly updateTagUseCase: UpdateTagUseCase) {}

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', description: 'ID da tag' })
  @ApiOperation({ summary: 'Atualizar tag existente' })
  @ApiResponse({
    status: 200,
    description: 'Tag atualizada com sucesso',
    type: TagResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Tag não encontrada' })
  async update(
    @Param('id') id: string,
    @Body() updateTagDto: UpdateTagDto,
    @User('id') userId: string,
  ): Promise<TagResponseDto> {
    const tag = await this.updateTagUseCase.execute(id, updateTagDto, userId);
    return TagResponseDto.fromDomain(tag);
  }
}
