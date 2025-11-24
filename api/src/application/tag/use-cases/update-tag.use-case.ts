import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Tag } from '../../../domain/tag/entities/tag.entity';
import {
    ITagRepository,
    TAG_REPOSITORY,
} from '../../../domain/tag/repositories/tag.repository.interface';

interface UpdateTagRequest {
  name?: string;
  description?: string;
  color?: string;
  isActive?: boolean;
}

@Injectable()
export class UpdateTagUseCase {
  constructor(
    @Inject(TAG_REPOSITORY)
    private readonly tagRepository: ITagRepository,
  ) {}

  async execute(
    id: string,
    request: UpdateTagRequest,
    userId: string,
  ): Promise<Tag> {
    const tag = await this.tagRepository.findById(id, userId);

    if (!tag) {
      throw new NotFoundException('Tag não encontrada');
    }

    return this.tagRepository.update(id, request);
  }
}
