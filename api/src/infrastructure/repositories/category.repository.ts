import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ICategoryRepository } from '../../domain/category/repositories/category.repository.interface';
import { Category } from '../../domain/category/entities/category.entity';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(private prisma: PrismaService) {}

  async create(category: Category, userId: string): Promise<Category> {
    const created = await this.prisma.category.create({
      data: {
        id: category.id,
        name: category.name,
        description: category.description,
        parentId: category.parentId,
        isActive: category.isActive,
        order: category.order,
        userId,
      },
      include: {
        parent: true,
        children: true,
      },
    });

    return this.toDomain(created);
  }

  async findById(id: string, userId?: string): Promise<Category | null> {
    const where: any = { id };
    if (userId) where.userId = userId;

    const category = await this.prisma.category.findFirst({
      where,
      include: {
        parent: true,
        children: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    return category ? this.toDomain(category) : null;
  }

  async findAll(userId?: string, includeInactive = false): Promise<Category[]> {
    const where: any = {};
    if (userId) where.userId = userId;
    if (!includeInactive) where.isActive = true;

    const categories = await this.prisma.category.findMany({
      where,
      include: {
        parent: true,
        children: {
          where: includeInactive ? {} : { isActive: true },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    });

    return categories.map((cat) => this.toDomain(cat));
  }

  async findByParentId(parentId: string | null, userId?: string): Promise<Category[]> {
    const where: any = { parentId, isActive: true };
    if (userId) where.userId = userId;

    const categories = await this.prisma.category.findMany({
      where,
      include: {
        parent: true,
        children: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    });

    return categories.map((cat) => this.toDomain(cat));
  }

  async findRootCategories(userId?: string): Promise<Category[]> {
    return this.findByParentId(null, userId);
  }

  async findSubcategories(parentId: string, userId?: string): Promise<Category[]> {
    return this.findByParentId(parentId, userId);
  }

  async findWithChildren(userId?: string): Promise<Category[]> {
    const where: any = { parentId: null, isActive: true };
    if (userId) where.userId = userId;

    const categories = await this.prisma.category.findMany({
      where,
      include: {
        children: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    });

    return categories.map((cat) => this.toDomain(cat));
  }

  async update(category: Category, userId?: string): Promise<Category> {
    const where: any = { id: category.id };
    if (userId) where.userId = userId;

    const updated = await this.prisma.category.update({
      where,
      data: {
        name: category.name,
        description: category.description,
        parentId: category.parentId,
        isActive: category.isActive,
        order: category.order,
      },
      include: {
        parent: true,
        children: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    return this.toDomain(updated);
  }

  async delete(id: string, userId?: string): Promise<void> {
    const where: any = { id };
    if (userId) where.userId = userId;

    await this.prisma.category.delete({ where });
  }

  async exists(name: string, parentId: string | null, userId: string, excludeId?: string): Promise<boolean> {
    const where: any = {
      name,
      parentId,
      userId,
    };

    if (excludeId) {
      where.id = { not: excludeId };
    }

    const count = await this.prisma.category.count({ where });
    return count > 0;
  }

  private toDomain(prismaCategory: any): Category {
    return new Category({
      id: prismaCategory.id,
      name: prismaCategory.name,
      description: prismaCategory.description,
      parentId: prismaCategory.parentId,
      isActive: prismaCategory.isActive,
      order: prismaCategory.order,
      userId: prismaCategory.userId,
      createdAt: prismaCategory.createdAt,
      updatedAt: prismaCategory.updatedAt,
      parent: prismaCategory.parent ? this.toDomainSimple(prismaCategory.parent) : undefined,
      children: prismaCategory.children?.map((child: any) => this.toDomainSimple(child)),
    });
  }

  private toDomainSimple(prismaCategory: any): Category {
    return new Category({
      id: prismaCategory.id,
      name: prismaCategory.name,
      description: prismaCategory.description,
      parentId: prismaCategory.parentId,
      isActive: prismaCategory.isActive,
      order: prismaCategory.order,
      userId: prismaCategory.userId,
      createdAt: prismaCategory.createdAt,
      updatedAt: prismaCategory.updatedAt,
    });
  }
}
