export class PhoneValidator {
  private static readonly PHONE_REGEX = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;

  static isValid(phone: string): boolean {
    return this.PHONE_REGEX.test(phone);
  }

  static validate(phone: string): void {
    if (!this.isValid(phone)) {
      throw new Error(`Invalid phone number format: ${phone}`);
    }
  }
}
