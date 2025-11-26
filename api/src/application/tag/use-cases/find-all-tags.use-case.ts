import { Inject, Injectable } from '@nestjs/common';
import { Tag } from '../../../domain/tag/entities/tag.entity';
import {
    ITagRepository,
    TAG_REPOSITORY,
} from '../../../domain/tag/repositories/tag.repository.interface';

@Injectable()
export class FindAllTagsUseCase {
  constructor(
    @Inject(TAG_REPOSITORY)
    private readonly tagRepository: ITagRepository,
  ) {}

  async execute(userId: string): Promise<Tag[]> {
    return this.tagRepository.findAll(userId);
  }
}
