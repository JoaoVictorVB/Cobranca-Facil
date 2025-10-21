export abstract class Entity<T> {
  protected readonly _id: string;
  protected props: T;

  constructor(props: T, id?: string) {
    this._id = id || this.generateId();
    this.props = props;
  }

  get id(): string {
    return this._id;
  }

  protected abstract generateId(): string;

  public equals(entity: Entity<T>): boolean {
    if (!entity) return false;
    if (this === entity) return true;
    return this._id === entity._id;
  }
}
