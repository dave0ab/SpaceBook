import { IsString, IsNumber, IsEnum, IsOptional, Min, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SpaceType } from '@prisma/client';

export class UpdateSpaceDto {
  @ApiProperty({ example: 'Main Auditorium', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiProperty({ example: 'auditorium', enum: SpaceType, required: false })
  @IsOptional()
  @IsEnum(SpaceType)
  type?: SpaceType;

  @ApiProperty({ example: 500, minimum: 1, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  capacity?: number;

  @ApiProperty({ example: 'Large auditorium...', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '/modern-auditorium-interior.jpg', required: false })
  @IsOptional()
  @IsString()
  image?: string;
}














