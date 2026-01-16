import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingStatus, UserRole } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createBookingDto: CreateBookingDto) {
    // Check for time slot conflicts
    const conflict = await this.checkTimeSlotConflict(
      createBookingDto.spaceId,
      createBookingDto.date,
      createBookingDto.startTime,
      createBookingDto.endTime,
    );

    if (conflict) {
      throw new BadRequestException('Time slot conflict: Another booking exists for this time slot');
    }

    // Verify space exists
    const space = await this.prisma.space.findUnique({
      where: { id: createBookingDto.spaceId },
    });

    if (!space) {
      throw new NotFoundException(`Space with ID ${createBookingDto.spaceId} not found`);
    }

    return this.prisma.booking.create({
      data: {
        userId,
        spaceId: createBookingDto.spaceId,
        date: new Date(createBookingDto.date),
        startTime: createBookingDto.startTime,
        endTime: createBookingDto.endTime,
        notes: createBookingDto.notes,
        status: BookingStatus.pending,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        space: true,
      },
    });
  }

  async findAll(userId?: string, status?: BookingStatus, date?: string) {
    const where: any = {};

    if (userId) {
      where.userId = userId;
    }

    if (status) {
      where.status = status;
    }

    if (date) {
      where.date = new Date(date);
    }

    return this.prisma.booking.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        space: true,
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async getCountsByDate(userId?: string, startDate?: string, endDate?: string) {
    const where: any = {};

    if (userId) {
      where.userId = userId;
    }

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const bookings = await this.prisma.booking.findMany({
      where,
      select: {
        date: true,
        status: true,
      },
    });

    // Group by date and status
    const counts: Record<string, Record<BookingStatus, number>> = {};

    bookings.forEach((booking) => {
      const dateKey = booking.date.toISOString().split('T')[0];
      if (!counts[dateKey]) {
        counts[dateKey] = {
          [BookingStatus.pending]: 0,
          [BookingStatus.approved]: 0,
          [BookingStatus.rejected]: 0,
        };
      }
      counts[dateKey][booking.status]++;
    });

    return Object.entries(counts).map(([date, statusCounts]) => ({
      date,
      ...statusCounts,
    }));
  }

  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        space: true,
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  async update(id: string, userId: string, userRole: UserRole, updateBookingDto: UpdateBookingDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        space: true,
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    // Check permissions: users can only update their own bookings, admins can update any
    if (userRole !== UserRole.admin && booking.userId !== userId) {
      throw new ForbiddenException('You can only update your own bookings');
    }

    // If updating time/date, check for conflicts (excluding current booking)
    if (updateBookingDto.date || updateBookingDto.startTime || updateBookingDto.endTime) {
      const conflict = await this.checkTimeSlotConflict(
        booking.spaceId,
        updateBookingDto.date || booking.date.toISOString().split('T')[0],
        updateBookingDto.startTime || booking.startTime,
        updateBookingDto.endTime || booking.endTime,
        id, // Exclude current booking
      );

      if (conflict) {
        throw new BadRequestException('Time slot conflict: Another booking exists for this time slot');
      }
    }

    const updateData: any = {};

    if (updateBookingDto.date) {
      updateData.date = new Date(updateBookingDto.date);
    }

    if (updateBookingDto.startTime) {
      updateData.startTime = updateBookingDto.startTime;
    }

    if (updateBookingDto.endTime) {
      updateData.endTime = updateBookingDto.endTime;
    }

    if (updateBookingDto.status !== undefined) {
      updateData.status = updateBookingDto.status;
    }

    if (updateBookingDto.notes !== undefined) {
      updateData.notes = updateBookingDto.notes;
    }

    return this.prisma.booking.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        space: true,
      },
    });
  }

  async remove(id: string, userId: string, userRole: UserRole) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    // Check permissions: users can only delete their own bookings, admins can delete any
    if (userRole !== UserRole.admin && booking.userId !== userId) {
      throw new ForbiddenException('You can only delete your own bookings');
    }

    await this.prisma.booking.delete({
      where: { id },
    });

    return { message: 'Booking deleted successfully' };
  }

  private async checkTimeSlotConflict(
    spaceId: string,
    date: string,
    startTime: string,
    endTime: string,
    excludeBookingId?: string,
  ): Promise<boolean> {
    const bookingDate = new Date(date);
    const start = this.timeToMinutes(startTime);
    const end = this.timeToMinutes(endTime);

    const where: any = {
      spaceId,
      date: bookingDate,
      status: BookingStatus.approved, // Only check conflicts with approved bookings
    };

    if (excludeBookingId) {
      where.id = { not: excludeBookingId };
    }

    const existingBookings = await this.prisma.booking.findMany({
      where,
    });

    // Check if any existing booking overlaps with the requested time slot
    return existingBookings.some((booking) => {
      const bookingStart = this.timeToMinutes(booking.startTime);
      const bookingEnd = this.timeToMinutes(booking.endTime);

      // Check for overlap: new booking starts before existing ends AND new booking ends after existing starts
      return start < bookingEnd && end > bookingStart;
    });
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}
