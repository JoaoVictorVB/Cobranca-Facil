import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetAllClientsUseCase } from '../../../application/client/use-cases/get-all-clients.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { ClientResponseDto } from '../dto/client.response.dto';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';

@ApiTags(SWAGGER_TAGS.CLIENTS)
@Controller('clients')
@UseGuards(JwtAuthGuard)
export class GetAllClientsController {
  constructor(private readonly getAllClientsUseCase: GetAllClientsUseCase) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all clients' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiOkResponse({
    description: 'List of clients retrieved successfully',
    type: [ClientResponseDto],
  })
  async handler(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @User('id') userId?: string,
  ): Promise<ClientResponseDto[]> {
    const clients = await this.getAllClientsUseCase.execute({ page, limit }, userId);
    return clients.map((client) => ClientResponseDto.fromDomain(client));
  }
}
