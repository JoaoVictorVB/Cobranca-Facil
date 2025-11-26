import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateRelationshipUseCase } from '../../../application/distribution/use-cases/create-relationship.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { BusinessRelationshipResponseDto } from '../dto/business-relationship.response.dto';
import { CreateRelationshipRequestDto } from '../dto/create-relationship.request.dto';

@ApiTags('Distribution')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('distribution/relationships')
export class CreateRelationshipController {
  constructor(private readonly createRelationshipUseCase: CreateRelationshipUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Create business relationship with reseller' })
  async handle(
    @Body() dto: CreateRelationshipRequestDto,
    @User('id') supplierId: string,
  ): Promise<BusinessRelationshipResponseDto> {
    const relationship = await this.createRelationshipUseCase.execute(
      supplierId,
      dto.resellerIdentifier,
    );
    return BusinessRelationshipResponseDto.fromDomain(relationship);
  }
}
