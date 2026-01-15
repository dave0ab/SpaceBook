import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingStatus, UserRole } from '@prisma/client';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(private prisma: PrismaService) {}

  async create(userId: string, createBookingDto: CreateBookingDto) {
    // Check for time slot conflicts
    const conflictingBooking = await this.prisma.booking.findFirst({
      where: {
        spaceId: createBookingDto.spaceId,
        date: new Date(createBookingDto.date),
        status: {
          not: 'rejected',
        },
        OR: [
          // New booking starts during existing booking
          {
            startTime: { lte: createBookingDto.startTime },
            endTime: { gt: createBookingDto.startTime },
          },
          // New booking ends during existing booking
          {
            startTime: { lt: createBookingDto.endTime },
            endTime: { gte: createBookingDto.endTime },
          },
          // New booking completely contains existing booking
          {
            startTime: { gte: createBookingDto.startTime },
            endTime: { lte: createBookingDto.endTime },
          },
        ],
      },
    });

    if (conflictingBooking) {
      throw new BadRequestException('Time slot conflict: Another booking exists for this time period');
    }

    return this.prisma.booking.create({
      data: {
        userId,
        ...createBookingDto,
        date: new Date(createBookingDto.date),
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
      const startOfDay = new Date(date + 'T00:00:00.000Z');
      const endOfDay = new Date(date + 'T23:59:59.999Z');
      where.date = {
        gte: startOfDay,
        lte: endOfDay,
      };
      this.logger.log(`📅 [BOOKINGS] Filtering by date: ${date} -> ${startOfDay.toISOString()} to ${endOfDay.toISOString()}`);
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
        createdAt: 'desc',
      },
    });
  }

  async getCountsByDate(userId?: string, startDate?: string, endDate?: string) {
    const where: any = {};

    if (userId) {
      where.userId = userId;
    }

    if (startDate && endDate) {
      const start = new Date(startDate + 'T00:00:00.000Z');
      const end = new Date(endDate + 'T23:59:59.999Z');
      where.date = {
        gte: start,
        lte: end,
      };
    }

    const bookings = await this.prisma.booking.findMany({
      where,
      select: {
        date: true,
      },
    });

    // Group by date and count
    const countsByDate: Record<string, number> = {};
    bookings.forEach((booking) => {
      const dateStr = booking.date.toISOString().split('T')[0];
      countsByDate[dateStr] = (countsByDate[dateStr] || 0) + 1;
    });

    return countsByDate;
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

  async update(id: string, userId: string, role: UserRole, updateBookingDto: UpdateBookingDto) {
    const booking = await this.findOne(id);

    // Check permissions
    if (role !== UserRole.admin && booking.userId !== userId) {
      throw new ForbiddenException('You can only update your own bookings');
    }

    // If updating date/time, check for conflicts
    if (updateBookingDto.date || updateBookingDto.startTime || updateBookingDto.endTime) {
      const date = updateBookingDto.date ? new Date(updateBookingDto.date) : booking.date;
      const startTime = updateBookingDto.startTime || booking.startTime;
      const endTime = updateBookingDto.endTime || booking.endTime;

      const conflictingBooking = await this.prisma.booking.findFirst({
        where: {
          id: { not: id },
          spaceId: booking.spaceId,
          date: date,
          status: {
            not: 'rejected',
          },
          OR: [
            {
              startTime: { lte: startTime },
              endTime: { gt: startTime },
            },
            {
              startTime: { lt: endTime },
              endTime: { gte: endTime },
            },
            {
              startTime: { gte: startTime },
              endTime: { lte: endTime },
            },
          ],
        },
      });

      if (conflictingBooking) {
        throw new BadRequestException('Time slot conflict: Another booking exists for this time period');
      }
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id },
      data: {
        ...updateBookingDto,
        date: updateBookingDto.date ? new Date(updateBookingDto.date) : undefined,
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

    return updatedBooking;
  }

  async remove(id: string, userId: string, role: UserRole) {
    const booking = await this.findOne(id);

    // Check permissions
    if (role !== UserRole.admin && booking.userId !== userId) {
      throw new ForbiddenException('You can only delete your own bookings');
    }

    await this.prisma.booking.delete({
      where: { id },
    });

    return { message: 'Booking deleted successfully' };
  }
}
