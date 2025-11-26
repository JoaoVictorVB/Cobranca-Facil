export enum RelationshipStatus {
  PENDENTE = 'PENDENTE',
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
}

export interface BusinessRelationshipProps {
  id: string;
  supplierId: string;
  resellerId: string;
  status: RelationshipStatus;
  inviteToken?: string;
  createdAt: Date;
  acceptedAt?: Date;
}

export class BusinessRelationship {
  private constructor(private readonly props: BusinessRelationshipProps) {}

  static create(supplierId: string, resellerId: string): BusinessRelationship {
    return new BusinessRelationship({
      id: crypto.randomUUID(),
      supplierId,
      resellerId,
      status: RelationshipStatus.PENDENTE,
      createdAt: new Date(),
    });
  }

  static createWithToken(supplierId: string): BusinessRelationship {
    return new BusinessRelationship({
      id: crypto.randomUUID(),
      supplierId,
      resellerId: '', // Will be filled when token is accepted
      status: RelationshipStatus.PENDENTE,
      inviteToken: this.generateInviteToken(),
      createdAt: new Date(),
    });
  }

  private static generateInviteToken(): string {
    // Generate 6-digit alphanumeric code (uppercase only for simplicity)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    for (let i = 0; i < 6; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }

  static reconstitute(props: BusinessRelationshipProps): BusinessRelationship {
    return new BusinessRelationship(props);
  }

  accept(): void {
    if (this.props.status === RelationshipStatus.ATIVO) {
      throw new Error('Relationship is already active');
    }
    this.props.status = RelationshipStatus.ATIVO;
    this.props.acceptedAt = new Date();
  }

  deactivate(): void {
    this.props.status = RelationshipStatus.INATIVO;
  }

  get id(): string {
    return this.props.id;
  }

  get supplierId(): string {
    return this.props.supplierId;
  }

  get resellerId(): string {
    return this.props.resellerId;
  }

  get status(): RelationshipStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get acceptedAt(): Date | undefined {
    return this.props.acceptedAt;
  }

  get inviteToken(): string | undefined {
    return this.props.inviteToken;
  }

  setReseller(resellerId: string): void {
    if (this.props.resellerId && this.props.resellerId !== '') {
      throw new Error('Reseller already set');
    }
    this.props.resellerId = resellerId;
  }

  isActive(): boolean {
    return this.props.status === RelationshipStatus.ATIVO;
  }

  isPending(): boolean {
    return this.props.status === RelationshipStatus.PENDENTE;
  }
}
