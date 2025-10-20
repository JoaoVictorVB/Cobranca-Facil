import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateClientUseCase } from '../../application/client/use-cases/create-client.use-case';
import { DeleteClientUseCase } from '../../application/client/use-cases/delete-client.use-case';
import { GetAllClientsWithSalesUseCase } from '../../application/client/use-cases/get-all-clients-with-sales.use-case';
import { GetAllClientsUseCase } from '../../application/client/use-cases/get-all-clients.use-case';
import { GetClientByIdUseCase } from '../../application/client/use-cases/get-client-by-id.use-case';
import { UpdateClientUseCase } from '../../application/client/use-cases/update-client.use-case';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { User } from '../../common/decorators/user.decorator';
import { ClientResponseDto } from './dto/client.response.dto';
import { CreateClientRequestDto } from './dto/create-client.request.dto';
import { UpdateClientRequestDto } from './dto/update-client.request.dto';

@ApiTags('clients')
@Controller('clients')
@UseGuards(JwtAuthGuard)
export class ClientController {
  constructor(
    private readonly createClientUseCase: CreateClientUseCase,
    private readonly getClientByIdUseCase: GetClientByIdUseCase,
    private readonly getAllClientsUseCase: GetAllClientsUseCase,
    private readonly getAllClientsWithSalesUseCase: GetAllClientsWithSalesUseCase,
    private readonly updateClientUseCase: UpdateClientUseCase,
    private readonly deleteClientUseCase: DeleteClientUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse({ status: 201, description: 'Client created successfully', type: ClientResponseDto })
  async create(
    @Body() dto: CreateClientRequestDto,
    @User('id') userId: string,
  ): Promise<ClientResponseDto> {
    const client = await this.createClientUseCase.execute(dto, userId);
    return ClientResponseDto.fromDomain(client);
  }

  @Get()
  @ApiOperation({ summary: 'Get all clients' })
  @ApiResponse({ status: 200, description: 'List of clients', type: [ClientResponseDto] })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @User('id') userId?: string,
  ): Promise<ClientResponseDto[]> {
    const clients = await this.getAllClientsUseCase.execute({ page, limit }, userId);
    return clients.map((client) => ClientResponseDto.fromDomain(client));
  }

  @Get('with-sales')
  @ApiOperation({ summary: 'Get all clients with their sales and installments' })
  @ApiResponse({ status: 200, description: 'List of clients with sales' })
  async findAllWithSales(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @User('id') userId?: string,
  ) {
    return await this.getAllClientsWithSalesUseCase.execute({ page, limit }, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get client by ID' })
  @ApiResponse({ status: 200, description: 'Client found', type: ClientResponseDto })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async findOne(@Param('id') id: string, @User('id') userId: string): Promise<ClientResponseDto> {
    const client = await this.getClientByIdUseCase.execute(id, userId);
    return ClientResponseDto.fromDomain(client);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update client' })
  @ApiResponse({ status: 200, description: 'Client updated successfully', type: ClientResponseDto })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateClientRequestDto,
    @User('id') userId: string,
  ): Promise<ClientResponseDto> {
    const client = await this.updateClientUseCase.execute({ id, data: dto }, userId);
    return ClientResponseDto.fromDomain(client);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete client' })
  @ApiResponse({ status: 204, description: 'Client deleted successfully' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async remove(@Param('id') id: string, @User('id') userId: string): Promise<void> {
    await this.deleteClientUseCase.execute(id, userId);
  }
}
