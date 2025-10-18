import { randomUUID } from 'crypto';
import { Entity } from '../../common/entity.base';
import { Phone } from '../value-objects/phone.vo';

interface ClientProps {
  name: string;
  phone?: Phone;
  referredBy?: string;
  observation?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Client extends Entity<ClientProps> {
  private constructor(props: ClientProps, id?: string) {
    super(props, id);
  }

  get name(): string {
    return this.props.name;
  }

  get phone(): Phone | undefined {
    return this.props.phone;
  }

  get referredBy(): string | undefined {
    return this.props.referredBy;
  }

  get observation(): string | undefined {
    return this.props.observation;
  }

  get address(): string | undefined {
    return this.props.address;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  protected generateId(): string {
    return randomUUID();
  }

  public static create(props: {
    name: string;
    phone?: string;
    referredBy?: string;
    observation?: string;
    address?: string;
    createdAt?: Date;
    updatedAt?: Date;
    id?: string;
  }): Client {
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Client name is required');
    }

    const clientProps: ClientProps = {
      name: props.name.trim(),
      phone: props.phone ? Phone.create(props.phone) : undefined,
      referredBy: props.referredBy,
      observation: props.observation,
      address: props.address,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    };

    return new Client(clientProps, props.id);
  }

  public update(props: {
    name?: string;
    phone?: string;
    referredBy?: string;
    observation?: string;
    address?: string;
  }): void {
    if (props.name !== undefined) {
      if (!props.name || props.name.trim().length === 0) {
        throw new Error('Client name cannot be empty');
      }
      this.props.name = props.name.trim();
    }

    if (props.phone !== undefined) {
      this.props.phone = props.phone ? Phone.create(props.phone) : undefined;
    }

    if (props.referredBy !== undefined) {
      this.props.referredBy = props.referredBy;
    }

    if (props.observation !== undefined) {
      this.props.observation = props.observation;
    }

    if (props.address !== undefined) {
      this.props.address = props.address;
    }

    this.props.updatedAt = new Date();
  }
}
