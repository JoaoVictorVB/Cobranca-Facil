import { Injectable } from '@nestjs/common';
import { Client } from '../../../domain/client/entities/client.entity';
import { ClientNotFoundError } from '../../../domain/client/errors/client.errors';
import { IClientRepository } from '../../../domain/client/repositories/client.repository.interface';
import { IUseCase } from '../../common/use-case.interface';

@Injectable()
export class GetClientByIdUseCase implements IUseCase<string, Client> {
  constructor(private readonly clientRepository: IClientRepository) {}

  async execute(id: string): Promise<Client> {
    const client = await this.clientRepository.findById(id);

    if (!client) {
      throw new ClientNotFoundError(id);
    }

    return client;
  }
}
