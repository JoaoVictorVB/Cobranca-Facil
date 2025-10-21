import { Controller, Delete, HttpCode, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiNoContentResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteSaleUseCase } from '../../../application/sale/use-cases/delete-sale.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';

@ApiTags(SWAGGER_TAGS.SALES)
@Controller('sales')
@UseGuards(JwtAuthGuard)
export class DeleteSaleController {
  constructor(private readonly deleteSaleUseCase: DeleteSaleUseCase) {}

  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a sale and all its installments' })
  @ApiNoContentResponse({ description: 'Sale deleted successfully' })
  async handler(
    @Param('id') id: string,
    @User('id') userId: string,
  ): Promise<void> {
    await this.deleteSaleUseCase.execute(id, userId);
  }
}
