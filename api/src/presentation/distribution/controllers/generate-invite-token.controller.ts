import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GenerateInviteTokenUseCase } from '../../../application/distribution/use-cases/generate-invite-token.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';
import { BusinessRelationshipResponseDto } from '../dto/business-relationship.response.dto';

@ApiTags(SWAGGER_TAGS.DISTRIBUTION)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('distribution/invite-token')
export class GenerateInviteTokenController {
  constructor(private readonly generateInviteTokenUseCase: GenerateInviteTokenUseCase) {}

  @Post()
  @ApiOperation({ 
    summary: 'Generate invite token for supplier (New Partner)',
    description: 'Creates a 6-character invite code that can be shared with resellers to establish a business relationship'
  })
  async handle(
    @User('id') supplierId: string,
  ): Promise<BusinessRelationshipResponseDto> {
    const relationship = await this.generateInviteTokenUseCase.execute(supplierId);
    return BusinessRelationshipResponseDto.fromDomain(relationship);
  }
}
