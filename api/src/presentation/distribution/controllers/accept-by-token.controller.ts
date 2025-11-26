import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AcceptByTokenUseCase } from '../../../application/distribution/use-cases/accept-by-token.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';
import { AcceptByTokenRequestDto } from '../dto/accept-by-token.request.dto';
import { BusinessRelationshipResponseDto } from '../dto/business-relationship.response.dto';

@ApiTags(SWAGGER_TAGS.DISTRIBUTION)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('distribution/accept-by-token')
export class AcceptByTokenController {
  constructor(private readonly acceptByTokenUseCase: AcceptByTokenUseCase) {}

  @Post()
  @ApiOperation({ 
    summary: 'Accept supplier invitation using token (Reseller side)',
    description: 'Reseller enters 6-character code to establish relationship with supplier'
  })
  async handle(
    @Body() dto: AcceptByTokenRequestDto,
    @User('id') resellerId: string,
  ): Promise<BusinessRelationshipResponseDto> {
    const relationship = await this.acceptByTokenUseCase.execute(
      dto.token.toUpperCase(), // Normalize to uppercase
      resellerId,
    );
    return BusinessRelationshipResponseDto.fromDomain(relationship);
  }
}
