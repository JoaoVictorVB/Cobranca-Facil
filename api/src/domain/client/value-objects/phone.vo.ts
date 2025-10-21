import { ValueObject } from '../../common/value-object.base';

interface PhoneProps {
  value: string;
}

export class Phone extends ValueObject<PhoneProps> {
  private constructor(props: PhoneProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(phone: string): Phone {
    if (!phone || phone.trim().length === 0) {
      throw new Error('Phone cannot be empty');
    }

    const cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      throw new Error('Invalid phone number format');
    }

    return new Phone({ value: cleanPhone });
  }

  public format(): string {
    const phone = this.props.value;
    if (phone.length === 11) {
      return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7)}`;
    }
    return `(${phone.slice(0, 2)}) ${phone.slice(2, 6)}-${phone.slice(6)}`;
  }
}
