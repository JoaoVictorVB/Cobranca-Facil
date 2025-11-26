import { Injectable } from '@nestjs/common';
import { Tag } from '../../domain/tag/entities/tag.entity';
import { ITagRepository } from '../../domain/tag/repositories/tag.repository.interface';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class TagRepository implements ITagRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tag: Tag): Promise<Tag> {
    const created = await this.prisma.tag.create({
      data: {
        id: tag.id,
        name: tag.name,
        description: tag.description,
        color: tag.color,
        isActive: tag.isActive,
        userId: tag.userId,
      },
    });

    return Tag.reconstitute(
      created.id,
      created.name,
      created.userId,
      created.description || undefined,
      created.color || undefined,
      created.isActive,
      created.createdAt,
      created.updatedAt,
    );
  }

  async findById(id: string, userId: string): Promise<Tag | null> {
    const tag = await this.prisma.tag.findFirst({
      where: { id, userId },
    });

    if (!tag) return null;

    return Tag.reconstitute(
      tag.id,
      tag.name,
      tag.userId,
      tag.description || undefined,
      tag.color || undefined,
      tag.isActive,
      tag.createdAt,
      tag.updatedAt,
    );
  }

  async findAll(userId: string): Promise<Tag[]> {
    const tags = await this.prisma.tag.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });

    return tags.map((tag) =>
      Tag.reconstitute(
        tag.id,
        tag.name,
        tag.userId,
        tag.description || undefined,
        tag.color || undefined,
        tag.isActive,
        tag.createdAt,
        tag.updatedAt,
      ),
    );
  }

  async update(id: string, data: Partial<Tag>): Promise<Tag> {
    const updated = await this.prisma.tag.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        color: data.color,
        isActive: data.isActive,
      },
    });

    return Tag.reconstitute(
      updated.id,
      updated.name,
      updated.userId,
      updated.description || undefined,
      updated.color || undefined,
      updated.isActive,
      updated.createdAt,
      updated.updatedAt,
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.tag.delete({
      where: { id },
    });
  }

  async findByName(name: string, userId: string): Promise<Tag | null> {
    const tag = await this.prisma.tag.findUnique({
      where: {
        userId_name: {
          userId,
          name,
        },
      },
    });

    if (!tag) return null;

    return Tag.reconstitute(
      tag.id,
      tag.name,
      tag.userId,
      tag.description || undefined,
      tag.color || undefined,
      tag.isActive,
      tag.createdAt,
      tag.updatedAt,
    );
  }
}
