import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateSaleUseCase } from '../../../application/sale/use-cases/create-sale.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { CreateSaleRequestDto } from '../dto/create-sale.request.dto';
import { SaleResponseDto } from '../dto/sale.response.dto';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';

@ApiTags(SWAGGER_TAGS.SALES)
@Controller('sales')
@UseGuards(JwtAuthGuard)
export class CreateSaleController {
  constructor(private readonly createSaleUseCase: CreateSaleUseCase) {}

  @Post()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new sale' })
  @ApiCreatedResponse({ description: 'Sale created successfully', type: SaleResponseDto })
  async handler(
    @Body() dto: CreateSaleRequestDto,
    @User('id') userId: string,
  ): Promise<SaleResponseDto> {
    const sale = await this.createSaleUseCase.execute(dto, userId);
    return SaleResponseDto.fromDomain(sale);
  }
}
