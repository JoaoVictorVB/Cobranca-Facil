import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetResellerInventoryUseCase } from '../../../application/distribution/use-cases/get-reseller-inventory.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { ResellerProductResponseDto } from '../dto/reseller-product.response.dto';

@ApiTags('Distribution')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('distribution/resellers')
export class GetResellerInventoryController {
  constructor(private readonly getInventoryUseCase: GetResellerInventoryUseCase) {}

  @Get(':resellerId/inventory')
  @ApiOperation({ summary: 'View reseller inventory (Stock Mirror)' })
  async handle(
    @Param('resellerId') resellerId: string,
    @User('id') supplierId: string,
  ): Promise<ResellerProductResponseDto[]> {
    return await this.getInventoryUseCase.execute(resellerId, supplierId);
  }
}
