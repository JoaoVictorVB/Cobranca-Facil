export class Tag {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly userId: string,
    public readonly description?: string,
    public readonly color?: string,
    public readonly isActive: boolean = true,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  static create(
    name: string,
    userId: string,
    description?: string,
    color?: string,
    isActive: boolean = true,
  ): Tag {
    return new Tag(
      crypto.randomUUID(),
      name,
      userId,
      description,
      color,
      isActive,
      new Date(),
      new Date(),
    );
  }

  static reconstitute(
    id: string,
    name: string,
    userId: string,
    description?: string,
    color?: string,
    isActive: boolean = true,
    createdAt?: Date,
    updatedAt?: Date,
  ): Tag {
    return new Tag(id, name, userId, description, color, isActive, createdAt, updatedAt);
  }
}
