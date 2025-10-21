import { Inject, Injectable } from '@nestjs/common';
import { ClientNotFoundError } from '../../../domain/client/errors/client.errors';
import { IClientRepository } from '../../../domain/client/repositories/client.repository.interface';
import { IUseCase } from '../../common/use-case.interface';

@Injectable()
export class DeleteClientUseCase implements IUseCase<string, void> {
  constructor(
    @Inject('IClientRepository')
    private readonly clientRepository: IClientRepository,
  ) {}

  async execute(id: string, userId?: string): Promise<void> {
    const client = await this.clientRepository.findById(id, userId);

    if (!client) {
      throw new ClientNotFoundError(id);
    }

    await this.clientRepository.delete(id, userId);
  }
}

