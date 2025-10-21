import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateClientUseCase } from '../../../application/client/use-cases/create-client.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';
import { ClientResponseDto } from '../dto/client.response.dto';
import { CreateClientRequestDto } from '../dto/create-client.request.dto';

@ApiTags(SWAGGER_TAGS.CLIENTS)
@Controller('clients')
@UseGuards(JwtAuthGuard)
export class CreateClientController {
  constructor(private readonly createClientUseCase: CreateClientUseCase) {}

  @Post()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new client' })
  @ApiCreatedResponse({ description: 'Client created successfully', type: ClientResponseDto })
  async handler(
    @Body() dto: CreateClientRequestDto,
    @User('id') userId: string,
  ): Promise<ClientResponseDto> {
    const client = await this.createClientUseCase.execute(dto, userId);
    return ClientResponseDto.fromDomain(client);
  }
}
