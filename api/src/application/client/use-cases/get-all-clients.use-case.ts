import { Inject, Injectable } from '@nestjs/common';
import { Client } from '../../../domain/client/entities/client.entity';
import { IClientRepository } from '../../../domain/client/repositories/client.repository.interface';
import { IUseCase } from '../../common/use-case.interface';

interface GetAllClientsRequest {
  page?: number;
  limit?: number;
}

@Injectable()
export class GetAllClientsUseCase implements IUseCase<GetAllClientsRequest, Client[]> {
  constructor(
    @Inject('IClientRepository')
    private readonly clientRepository: IClientRepository,
  ) {}

  async execute(request: GetAllClientsRequest, userId?: string): Promise<Client[]> {
    return await this.clientRepository.findAll(userId, request.page, request.limit);
  }
}
