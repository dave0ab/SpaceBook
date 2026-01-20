import { IsString, IsDateString, IsOptional, IsEnum, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus } from '@prisma/client';

export class UpdateBookingDto {
  @ApiProperty({ example: '2026-01-15', required: false })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({ example: '09:00', description: 'Time in HH:mm format', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'startTime must be in HH:mm format',
  })
  startTime?: string;

  @ApiProperty({ example: '12:00', description: 'Time in HH:mm format', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'endTime must be in HH:mm format',
  })
  endTime?: string;

  @ApiProperty({ example: 'approved', enum: BookingStatus, required: false })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @ApiProperty({ example: 'Company annual meeting', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}



















