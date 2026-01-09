import { IsString, IsNumber, IsEnum, Min, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SpaceType } from '@prisma/client';

export class CreateSpaceDto {
  @ApiProperty({ example: 'Main Auditorium' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'auditorium', enum: SpaceType })
  @IsEnum(SpaceType)
  type: SpaceType;

  @ApiProperty({ example: 500, minimum: 1 })
  @IsNumber()
  @Min(1)
  capacity: number;

  @ApiProperty({ example: 'Large auditorium with state-of-the-art sound system' })
  @IsString()
  description: string;

  @ApiProperty({ example: '/modern-auditorium-interior.jpg' })
  @IsString()
  image: string;
}


