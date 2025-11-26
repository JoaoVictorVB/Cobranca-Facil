import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindResellersBySupplierUseCase } from '../../../application/distribution/use-cases/find-resellers-by-supplier.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { BusinessRelationshipResponseDto } from '../dto/business-relationship.response.dto';

@ApiTags('Distribution')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('distribution/resellers')
export class FindResellersController {
  constructor(private readonly findResellersUseCase: FindResellersBySupplierUseCase) {}

  @Get()
  @ApiOperation({ summary: 'List my resellers' })
  async handle(@User('id') supplierId: string): Promise<BusinessRelationshipResponseDto[]> {
    const relationships = await this.findResellersUseCase.execute(supplierId);
    return relationships.map((r) => BusinessRelationshipResponseDto.fromDomain(r));
  }
}
