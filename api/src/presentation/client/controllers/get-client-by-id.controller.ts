import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GetClientByIdUseCase } from '../../../application/client/use-cases/get-client-by-id.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { ClientResponseDto } from '../dto/client.response.dto';

@ApiTags('clients')
@Controller('clients')
@UseGuards(JwtAuthGuard)
export class GetClientByIdController {
  constructor(private readonly getClientByIdUseCase: GetClientByIdUseCase) {}

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get client by ID' })
  @ApiOkResponse({
    description: 'Client found successfully',
    type: ClientResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Client not found' })
  async handler(@Param('id') id: string, @User('id') userId: string): Promise<ClientResponseDto> {
    const client = await this.getClientByIdUseCase.execute(id, userId);
    return ClientResponseDto.fromDomain(client);
  }
}
