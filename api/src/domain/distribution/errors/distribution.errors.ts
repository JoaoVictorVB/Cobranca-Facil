export class InsufficientStockError extends Error {
  constructor(productName: string, available: number, requested: number) {
    super(
      `Insufficient stock for product "${productName}". Available: ${available}, Requested: ${requested}`,
    );
    this.name = 'InsufficientStockError';
  }
}

export class RelationshipNotFoundError extends Error {
  constructor() {
    super('Business relationship not found or not active');
    this.name = 'RelationshipNotFoundError';
  }
}

export class UnauthorizedAccessError extends Error {
  constructor(message: string = 'Unauthorized access to reseller data') {
    super(message);
    this.name = 'UnauthorizedAccessError';
  }
}

export class TransferNotFoundError extends Error {
  constructor(transferId: string) {
    super(`Stock transfer with id "${transferId}" not found`);
    this.name = 'TransferNotFoundError';
  }
}

export class InvalidTransferStatusError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidTransferStatusError';
  }
}
