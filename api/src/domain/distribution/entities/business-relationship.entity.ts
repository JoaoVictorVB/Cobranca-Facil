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

  isActive(): boolean {
    return this.props.status === RelationshipStatus.ATIVO;
  }

  isPending(): boolean {
    return this.props.status === RelationshipStatus.PENDENTE;
  }
}
