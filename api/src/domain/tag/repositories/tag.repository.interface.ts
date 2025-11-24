import { Tag } from '../entities/tag.entity';

export interface ITagRepository {
  create(tag: Tag): Promise<Tag>;
  findById(id: string, userId: string): Promise<Tag | null>;
  findAll(userId: string): Promise<Tag[]>;
  update(id: string, tag: Partial<Tag>): Promise<Tag>;
  delete(id: string): Promise<void>;
  findByName(name: string, userId: string): Promise<Tag | null>;
}

export const TAG_REPOSITORY = Symbol('ITagRepository');
