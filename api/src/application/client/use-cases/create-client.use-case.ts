import { Injectable } from '@nestjs/common';
import { Client } from '../../../domain/client/entities/client.entity';
import { InvalidPhoneNumberError } from '../../../domain/client/errors/client.errors';
import { IClientRepository } from '../../../domain/client/repositories/client.repository.interface';
import { IUseCase } from '../../common/use-case.interface';
import { CreateClientDto } from '../dto/create-client.dto';

@Injectable()
export class CreateClientUseCase implements IUseCase<CreateClientDto, Client> {
  constructor(private readonly clientRepository: IClientRepository) {}

  async execute(request: CreateClientDto, userId: string): Promise<Client> {
    if (request.phone && !this.isValidPhone(request.phone)) {
      throw new InvalidPhoneNumberError(request.phone);
    }

    const client = Client.create({
      name: request.name,
      phone: request.phone,
      referredBy: request.referredBy,
    });

    return await this.clientRepository.create(client, userId);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
    return phoneRegex.test(phone);
  }
}
