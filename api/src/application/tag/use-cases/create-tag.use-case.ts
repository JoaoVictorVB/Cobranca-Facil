import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Tag } from '../../../domain/tag/entities/tag.entity';
import {
    ITagRepository,
    TAG_REPOSITORY,
} from '../../../domain/tag/repositories/tag.repository.interface';

interface CreateTagRequest {
  name: string;
  description?: string;
  color?: string;
  isActive?: boolean;
}

@Injectable()
export class CreateTagUseCase {
  constructor(
    @Inject(TAG_REPOSITORY)
    private readonly tagRepository: ITagRepository,
  ) {}

  async execute(request: CreateTagRequest, userId: string): Promise<Tag> {
    // Verificar se já existe uma tag com o mesmo nome
    const existingTag = await this.tagRepository.findByName(
      request.name,
      userId,
    );

    if (existingTag) {
      throw new ConflictException(
        `Já existe uma tag com o nome "${request.name}"`,
      );
    }

    const tag = Tag.create(
      request.name,
      userId,
      request.description,
      request.color,
      request.isActive ?? true,
    );

    return this.tagRepository.create(tag);
  }
}
