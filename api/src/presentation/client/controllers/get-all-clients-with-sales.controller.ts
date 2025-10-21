import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetAllClientsWithSalesUseCase } from '../../../application/client/use-cases/get-all-clients-with-sales.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';

@ApiTags(SWAGGER_TAGS.CLIENTS)
@Controller('clients')
@UseGuards(JwtAuthGuard)
export class GetAllClientsWithSalesController {
  constructor(private readonly getAllClientsWithSalesUseCase: GetAllClientsWithSalesUseCase) {}

  @Get('with-sales')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all clients with their sales and installments' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiOkResponse({ description: 'List of clients with sales retrieved successfully' })
  async handler(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @User('id') userId?: string,
  ) {
    return await this.getAllClientsWithSalesUseCase.execute({ page, limit }, userId);
  }
}
