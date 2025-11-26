import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';
import { FindSuppliersUseCase } from '../../../application/distribution/use-cases/find-suppliers.use-case';
import { BusinessRelationshipResponseDto } from '../dto/business-relationship.response.dto';

/**
 * Controller: Find Suppliers (GET /distribution/suppliers)
 * Lista os fornecedores conectados ao revendedor autenticado.
 */
@ApiTags(SWAGGER_TAGS.DISTRIBUTION)
@ApiBearerAuth()
@Controller('distribution')
@UseGuards(JwtAuthGuard)
export class FindSuppliersController {
  constructor(private readonly findSuppliersUseCase: FindSuppliersUseCase) {}

  @Get('suppliers')
  @ApiOperation({
    summary: 'List my suppliers',
    description: 'Returns all suppliers connected to the authenticated reseller',
  })
  async handle(@User('id') userId: string): Promise<BusinessRelationshipResponseDto[]> {
    const relationships = await this.findSuppliersUseCase.execute(userId);
    return relationships.map((r) => BusinessRelationshipResponseDto.fromDomain(r));
  }
}
