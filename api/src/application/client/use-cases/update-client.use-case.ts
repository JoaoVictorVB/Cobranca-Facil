import { Injectable } from '@nestjs/common';
import { PhoneValidator } from '../../../common/validators/phone.validator';
import { Client } from '../../../domain/client/entities/client.entity';
import {
  ClientNotFoundError,
  InvalidPhoneNumberError,
} from '../../../domain/client/errors/client.errors';
import { IClientRepository } from '../../../domain/client/repositories/client.repository.interface';
import { IUseCase } from '../../common/use-case.interface';
import { UpdateClientData } from '../interfaces/client.interfaces';

interface UpdateClientRequest {
  id: string;
  data: UpdateClientData;
}

@Injectable()
export class UpdateClientUseCase implements IUseCase<UpdateClientRequest, Client> {
  constructor(private readonly clientRepository: IClientRepository) {}

  async execute(request: UpdateClientRequest, userId?: string): Promise<Client> {
    const client = await this.clientRepository.findById(request.id, userId);

    if (!client) {
      throw new ClientNotFoundError(request.id);
    }

    if (request.data.phone && !PhoneValidator.isValid(request.data.phone)) {
      throw new InvalidPhoneNumberError(request.data.phone);
    }

    client.update({
      name: request.data.name,
      phone: request.data.phone,
      referredBy: request.data.referredBy,
    });

    return await this.clientRepository.update(client, userId);
  }
}
