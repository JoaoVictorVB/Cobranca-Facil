import { Injectable } from '@nestjs/common';
import { Client } from '../../../domain/client/entities/client.entity';
import { IClientRepository } from '../../../domain/client/repositories/client.repository.interface';
import { IUseCase } from '../../common/use-case.interface';

interface GetAllClientsRequest {
  page?: number;
  limit?: number;
}

@Injectable()
export class GetAllClientsUseCase implements IUseCase<GetAllClientsRequest, Client[]> {
  constructor(private readonly clientRepository: IClientRepository) {}

  async execute(request: GetAllClientsRequest): Promise<Client[]> {
    return await this.clientRepository.findAll(request.page, request.limit);
  }
}
