import { Injectable } from '@nestjs/common';
import { Client } from '../../../domain/client/entities/client.entity';
import {
  ClientNotFoundError,
  InvalidPhoneNumberError,
} from '../../../domain/client/errors/client.errors';
import { IClientRepository } from '../../../domain/client/repositories/client.repository.interface';
import { IUseCase } from '../../common/use-case.interface';
import { UpdateClientDto } from '../dto/update-client.dto';

interface UpdateClientRequest {
  id: string;
  data: UpdateClientDto;
}

@Injectable()
export class UpdateClientUseCase
  implements IUseCase<UpdateClientRequest, Client>
{
  constructor(private readonly clientRepository: IClientRepository) {}

  async execute(request: UpdateClientRequest): Promise<Client> {
    const client = await this.clientRepository.findById(request.id);

    if (!client) {
      throw new ClientNotFoundError(request.id);
    }

    // Validar telefone se fornecido
    if (request.data.phone && !this.isValidPhone(request.data.phone)) {
      throw new InvalidPhoneNumberError(request.data.phone);
    }

    client.update({
      name: request.data.name,
      phone: request.data.phone,
      referredBy: request.data.referredBy,
    });

    return await this.clientRepository.update(client);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
    return phoneRegex.test(phone);
  }
}
