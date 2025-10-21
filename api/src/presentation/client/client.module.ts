import { Module } from '@nestjs/common';
import { CreateClientUseCase } from '../../application/client/use-cases/create-client.use-case';
import { DeleteClientUseCase } from '../../application/client/use-cases/delete-client.use-case';
import { GetAllClientsWithSalesUseCase } from '../../application/client/use-cases/get-all-clients-with-sales.use-case';
import { GetAllClientsUseCase } from '../../application/client/use-cases/get-all-clients.use-case';
import { GetClientByIdUseCase } from '../../application/client/use-cases/get-client-by-id.use-case';
import { UpdateClientUseCase } from '../../application/client/use-cases/update-client.use-case';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { ClientRepository } from '../../infrastructure/repositories/client.repository';
import {
  CreateClientController,
  DeleteClientController,
  GetAllClientsController,
  GetAllClientsWithSalesController,
  GetClientByIdController,
  UpdateClientController,
} from './controllers';

@Module({
  controllers: [
    CreateClientController,
    GetAllClientsController,
    GetAllClientsWithSalesController,
    GetClientByIdController,
    UpdateClientController,
    DeleteClientController,
  ],
  providers: [
    PrismaService,
    {
      provide: 'IClientRepository',
      useClass: ClientRepository,
    },
    CreateClientUseCase,
    GetClientByIdUseCase,
    GetAllClientsUseCase,
    GetAllClientsWithSalesUseCase,
    UpdateClientUseCase,
    DeleteClientUseCase,
  ],
  exports: ['IClientRepository'],
})
export class ClientModule {}
