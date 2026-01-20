import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '@prisma/client';

export class CreateNotificationDto {
  @ApiProperty({ example: 'user-uuid' })
  @IsUUID()
  userId: string;

  @ApiProperty({ example: 'Booking Approved' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Your booking has been approved' })
  @IsString()
  message: string;

  @ApiProperty({ example: 'status_update', enum: NotificationType })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({ example: 'booking-uuid', required: false })
  @IsOptional()
  @IsUUID()
  bookingId?: string;
}



















