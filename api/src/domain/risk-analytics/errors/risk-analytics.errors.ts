export class InsufficientDataError extends Error {
  constructor(message: string = 'Insufficient data to calculate risk') {
    super(message);
    this.name = 'InsufficientDataError';
  }
}

export class InvalidDateError extends Error {
  constructor(message: string = 'Check date must be in the future') {
    super(message);
    this.name = 'InvalidDateError';
  }
}
