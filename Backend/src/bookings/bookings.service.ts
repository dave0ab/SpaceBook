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
      // For date-only fields, create Date objects from the date strings
      // The date strings are in YYYY-MM-DD format
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const bookings = await this.prisma.booking.findMany({
      where,
      select: {
        date: true,
      },
    });

    // Group by date and count total bookings per date
    const counts: Record<string, number> = {};

    bookings.forEach((booking) => {
      const dateKey = booking.date.toISOString().split('T')[0];
      counts[dateKey] = (counts[dateKey] || 0) + 1;
    });

    return counts;
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

  async getBookingsByUser(startDate?: string, endDate?: string, status?: BookingStatus) {
    const where: any = {};

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    if (status) {
      where.status = status;
    }

    const bookings = await this.prisma.booking.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Group by user and count
    const userCounts: Record<string, { userId: string; userName: string; userEmail: string; count: number }> = {};

    bookings.forEach((booking) => {
      const userId = booking.userId;
      if (!userCounts[userId]) {
        userCounts[userId] = {
          userId: booking.user.id,
          userName: booking.user.name,
          userEmail: booking.user.email,
          count: 0,
        };
      }
      userCounts[userId].count++;
    });

    // Convert to array and sort by count (descending)
    return Object.values(userCounts).sort((a, b) => b.count - a.count);
  }

  async getBookingsBySpace(startDate?: string, endDate?: string, status?: BookingStatus) {
    const where: any = {};

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    if (status) {
      where.status = status;
    }

    const bookings = await this.prisma.booking.findMany({
      where,
      include: {
        space: true,
      },
    });

    // Group by space and count
    const spaceCounts: Record<string, { spaceId: string; spaceName: string; spaceType: string; count: number }> = {};

    bookings.forEach((booking) => {
      const spaceId = booking.spaceId;
      if (!spaceCounts[spaceId]) {
        spaceCounts[spaceId] = {
          spaceId: booking.space.id,
          spaceName: booking.space.name,
          spaceType: booking.space.type,
          count: 0,
        };
      }
      spaceCounts[spaceId].count++;
    });

    // Convert to array and sort by count (descending)
    return Object.values(spaceCounts).sort((a, b) => b.count - a.count);
  }

  async getApprovedReservationsByDate(startDate: string, endDate: string) {
    const bookings = await this.prisma.booking.findMany({
      where: {
        status: BookingStatus.approved,
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      select: {
        date: true,
      },
    });

    // Group by date and count
    const counts: Record<string, number> = {};

    bookings.forEach((booking) => {
      const dateKey = booking.date.toISOString().split('T')[0];
      counts[dateKey] = (counts[dateKey] || 0) + 1;
    });

    return counts;
  }

  async getRejectedReservationsByDate(startDate: string, endDate: string) {
    const bookings = await this.prisma.booking.findMany({
      where: {
        status: BookingStatus.rejected,
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      select: {
        date: true,
      },
    });

    // Group by date and count
    const counts: Record<string, number> = {};

    bookings.forEach((booking) => {
      const dateKey = booking.date.toISOString().split('T')[0];
      counts[dateKey] = (counts[dateKey] || 0) + 1;
    });

    return counts;
  }

  async getRejectedReservationsByUser(startDate?: string, endDate?: string) {
    const where: any = {
      status: BookingStatus.rejected,
    };

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const bookings = await this.prisma.booking.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Group by user and count
    const userCounts: Record<string, { userId: string; userName: string; userEmail: string; count: number }> = {};

    bookings.forEach((booking) => {
      const userId = booking.userId;
      if (!userCounts[userId]) {
        userCounts[userId] = {
          userId: booking.user.id,
          userName: booking.user.name,
          userEmail: booking.user.email,
          count: 0,
        };
      }
      userCounts[userId].count++;
    });

    // Convert to array and sort by count (descending)
    return Object.values(userCounts).sort((a, b) => b.count - a.count);
  }

  async getBookingsByUserDetailed(startDate?: string, endDate?: string) {
    const where: any = {};

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const bookings = await this.prisma.booking.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Group by user with status breakdown
    const userStats: Record<string, {
      userId: string;
      userName: string;
      userEmail: string;
      total: number;
      approved: number;
      rejected: number;
      pending: number;
    }> = {};

    bookings.forEach((booking) => {
      const userId = booking.userId;
      if (!userStats[userId]) {
        userStats[userId] = {
          userId: booking.user.id,
          userName: booking.user.name,
          userEmail: booking.user.email,
          total: 0,
          approved: 0,
          rejected: 0,
          pending: 0,
        };
      }
      userStats[userId].total++;
      if (booking.status === BookingStatus.approved) {
        userStats[userId].approved++;
      } else if (booking.status === BookingStatus.rejected) {
        userStats[userId].rejected++;
      } else if (booking.status === BookingStatus.pending) {
        userStats[userId].pending++;
      }
    });

    // Convert to array and sort by total (descending)
    return Object.values(userStats).sort((a, b) => b.total - a.total);
  }

  async getBookingsBySpaceDetailed(startDate?: string, endDate?: string) {
    const where: any = {};

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const bookings = await this.prisma.booking.findMany({
      where,
      include: {
        space: true,
      },
    });

    // Group by space with status breakdown
    const spaceStats: Record<string, {
      spaceId: string;
      spaceName: string;
      spaceType: string;
      total: number;
      approved: number;
      rejected: number;
      pending: number;
    }> = {};

    bookings.forEach((booking) => {
      const spaceId = booking.spaceId;
      if (!spaceStats[spaceId]) {
        spaceStats[spaceId] = {
          spaceId: booking.space.id,
          spaceName: booking.space.name,
          spaceType: booking.space.type,
          total: 0,
          approved: 0,
          rejected: 0,
          pending: 0,
        };
      }
      spaceStats[spaceId].total++;
      if (booking.status === BookingStatus.approved) {
        spaceStats[spaceId].approved++;
      } else if (booking.status === BookingStatus.rejected) {
        spaceStats[spaceId].rejected++;
      } else if (booking.status === BookingStatus.pending) {
        spaceStats[spaceId].pending++;
      }
    });

    // Convert to array and sort by total (descending)
    return Object.values(spaceStats).sort((a, b) => b.total - a.total);
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
