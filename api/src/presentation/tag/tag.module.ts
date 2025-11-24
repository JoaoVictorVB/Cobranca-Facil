import { Module } from '@nestjs/common';
import { CreateTagUseCase } from '../../application/tag/use-cases/create-tag.use-case';
import { DeleteTagUseCase } from '../../application/tag/use-cases/delete-tag.use-case';
import { FindAllTagsUseCase } from '../../application/tag/use-cases/find-all-tags.use-case';
import { UpdateTagUseCase } from '../../application/tag/use-cases/update-tag.use-case';
import { TAG_REPOSITORY } from '../../domain/tag/repositories/tag.repository.interface';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { TagRepository } from '../../infrastructure/repositories/tag.repository';
import {
    CreateTagController,
    DeleteTagController,
    FindAllTagsController,
    UpdateTagController,
} from './controllers';

@Module({
  imports: [],
  controllers: [
    CreateTagController,
    FindAllTagsController,
    UpdateTagController,
    DeleteTagController,
  ],
  providers: [
    {
      provide: TAG_REPOSITORY,
      useClass: TagRepository,
    },
    PrismaService,
    CreateTagUseCase,
    FindAllTagsUseCase,
    UpdateTagUseCase,
    DeleteTagUseCase,
  ],
  exports: [TAG_REPOSITORY],
})
export class TagModule {}
