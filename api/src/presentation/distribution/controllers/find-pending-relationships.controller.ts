import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindPendingRelationshipsUseCase } from '../../../application/distribution/use-cases/find-pending-relationships.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';
import { BusinessRelationshipResponseDto } from '../dto/business-relationship.response.dto';

@ApiTags(SWAGGER_TAGS.DISTRIBUTION)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('distribution/relationships')
export class FindPendingRelationshipsController {
  constructor(
    private readonly findPendingRelationshipsUseCase: FindPendingRelationshipsUseCase,
  ) {}

  @Get('pending')
  @ApiOperation({
    summary: 'List pending relationship invitations (reseller side)',
    description: 'Returns all business relationships where the current user is the reseller and status is PENDING',
  })
  async handle(@User('id') resellerId: string): Promise<BusinessRelationshipResponseDto[]> {
    const relationships = await this.findPendingRelationshipsUseCase.execute(resellerId);
    return relationships.map((rel) => BusinessRelationshipResponseDto.fromDomain(rel));
  }
}
