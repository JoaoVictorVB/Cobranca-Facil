import { Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AcceptRelationshipUseCase } from '../../../application/distribution/use-cases/accept-relationship.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';
import { BusinessRelationshipResponseDto } from '../dto/business-relationship.response.dto';

@ApiTags(SWAGGER_TAGS.DISTRIBUTION)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('distribution/relationships')
export class AcceptRelationshipController {
  constructor(private readonly acceptRelationshipUseCase: AcceptRelationshipUseCase) {}

  @Patch(':id/accept')
  @ApiOperation({ summary: 'Accept business relationship invitation (reseller side)' })
  async handle(
    @Param('id') relationshipId: string,
    @User('id') resellerId: string,
  ): Promise<BusinessRelationshipResponseDto> {
    const relationship = await this.acceptRelationshipUseCase.execute(
      relationshipId,
      resellerId,
    );
    return BusinessRelationshipResponseDto.fromDomain(relationship);
  }
}
