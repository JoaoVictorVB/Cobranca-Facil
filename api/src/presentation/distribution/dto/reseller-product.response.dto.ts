import { ApiProperty } from '@nestjs/swagger';

export class ResellerProductResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  stock: number;

  @ApiProperty()
  salePrice: number;

  @ApiProperty({ required: false })
  lastSaleDate?: Date;

  @ApiProperty({ required: false })
  daysSinceLastSale?: number;
}
