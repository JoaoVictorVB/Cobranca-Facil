import { Injectable } from '@nestjs/common';
import { PhoneValidator } from '../../../common/validators/phone.validator';
import { Client } from '../../../domain/client/entities/client.entity';
import { InvalidPhoneNumberError } from '../../../domain/client/errors/client.errors';
import { IClientRepository } from '../../../domain/client/repositories/client.repository.interface';
import { IUseCase } from '../../common/use-case.interface';
import { CreateClientData } from '../interfaces/client.interfaces';

@Injectable()
export class CreateClientUseCase implements IUseCase<CreateClientData, Client> {
  constructor(private readonly clientRepository: IClientRepository) {}

  async execute(request: CreateClientData, userId: string): Promise<Client> {
    if (request.phone && !PhoneValidator.isValid(request.phone)) {
      throw new InvalidPhoneNumberError(request.phone);
    }

    const client = Client.create({
      name: request.name,
      phone: request.phone,
      referredBy: request.referredBy,
    });

    return await this.clientRepository.create(client, userId);
  }
}
