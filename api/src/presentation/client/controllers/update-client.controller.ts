import { Body, Controller, HttpCode, HttpStatus, Param, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateClientUseCase } from '../../../application/client/use-cases/update-client.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { ClientResponseDto } from '../dto/client.response.dto';
import { UpdateClientRequestDto } from '../dto/update-client.request.dto';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';

@ApiTags(SWAGGER_TAGS.CLIENTS)
@Controller('clients')
@UseGuards(JwtAuthGuard)
export class UpdateClientController {
  constructor(private readonly updateClientUseCase: UpdateClientUseCase) {}

  @Put(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update client' })
  @ApiParam({ name: 'id', description: 'Client ID', type: String })
  @ApiOkResponse({ description: 'Client updated successfully', type: ClientResponseDto })
  @ApiNotFoundResponse({ description: 'Client not found' })
  async handler(
    @Param('id') id: string,
    @Body() dto: UpdateClientRequestDto,
    @User('id') userId: string,
  ): Promise<ClientResponseDto> {
    const client = await this.updateClientUseCase.execute({ id, data: dto }, userId);
    return ClientResponseDto.fromDomain(client);
  }
}
