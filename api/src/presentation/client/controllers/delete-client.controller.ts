import { Controller, Delete, HttpCode, HttpStatus, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { DeleteClientUseCase } from '../../../application/client/use-cases/delete-client.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';

@ApiTags('clients')
@Controller('clients')
@UseGuards(JwtAuthGuard)
export class DeleteClientController {
  constructor(private readonly deleteClientUseCase: DeleteClientUseCase) {}

  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete client' })
  @ApiNoContentResponse({ description: 'Client deleted successfully' })
  @ApiNotFoundResponse({ description: 'Client not found' })
  async handler(@Param('id') id: string, @User('id') userId: string): Promise<void> {
    await this.deleteClientUseCase.execute(id, userId);
  }
}
