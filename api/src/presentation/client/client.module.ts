import { Module } from '@nestjs/common';
import { CreateClientUseCase } from '../../application/client/use-cases/create-client.use-case';
import { DeleteClientUseCase } from '../../application/client/use-cases/delete-client.use-case';
import { GetAllClientsWithSalesUseCase } from '../../application/client/use-cases/get-all-clients-with-sales.use-case';
import { GetAllClientsUseCase } from '../../application/client/use-cases/get-all-clients.use-case';
import { GetClientByIdUseCase } from '../../application/client/use-cases/get-client-by-id.use-case';
import { UpdateClientUseCase } from '../../application/client/use-cases/update-client.use-case';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { ClientRepository } from '../../infrastructure/repositories/client.repository';
import { ClientController } from './client.controller';

@Module({
  controllers: [ClientController],
  providers: [
    PrismaService,
    {
      provide: 'IClientRepository',
      useClass: ClientRepository,
    },
    {
      provide: CreateClientUseCase,
      useFactory: (clientRepository: ClientRepository) => {
        return new CreateClientUseCase(clientRepository);
      },
      inject: ['IClientRepository'],
    },
    {
      provide: GetClientByIdUseCase,
      useFactory: (clientRepository: ClientRepository) => {
        return new GetClientByIdUseCase(clientRepository);
      },
      inject: ['IClientRepository'],
    },
    {
      provide: GetAllClientsUseCase,
      useFactory: (clientRepository: ClientRepository) => {
        return new GetAllClientsUseCase(clientRepository);
      },
      inject: ['IClientRepository'],
    },
    {
      provide: GetAllClientsWithSalesUseCase,
      useFactory: (clientRepository: ClientRepository) => {
        return new GetAllClientsWithSalesUseCase(clientRepository);
      },
      inject: ['IClientRepository'],
    },
    {
      provide: UpdateClientUseCase,
      useFactory: (clientRepository: ClientRepository) => {
        return new UpdateClientUseCase(clientRepository);
      },
      inject: ['IClientRepository'],
    },
    {
      provide: DeleteClientUseCase,
      useFactory: (clientRepository: ClientRepository) => {
        return new DeleteClientUseCase(clientRepository);
      },
      inject: ['IClientRepository'],
    },
  ],
  exports: ['IClientRepository'],
})
export class ClientModule {}
