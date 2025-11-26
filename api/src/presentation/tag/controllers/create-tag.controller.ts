import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { CreateTagUseCase } from '../../../application/tag/use-cases/create-tag.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';
import { CreateTagDto } from '../dto/create-tag.dto';
import { TagResponseDto } from '../dto/tag-response.dto';

@ApiTags(SWAGGER_TAGS.TAGS)
@Controller('tags')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CreateTagController {
  constructor(private readonly createTagUseCase: CreateTagUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar nova tag/rótulo' })
  @ApiResponse({
    status: 201,
    description: 'Tag criada com sucesso',
    type: TagResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Tag com este nome já existe' })
  async create(
    @Body() createTagDto: CreateTagDto,
    @User('id') userId: string,
  ): Promise<TagResponseDto> {
    const tag = await this.createTagUseCase.execute(createTagDto, userId);
    return TagResponseDto.fromDomain(tag);
  }
}
