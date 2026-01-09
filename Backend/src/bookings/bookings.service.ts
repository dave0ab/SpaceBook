import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingStatus, NotificationType } from '@prisma/client';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(private prisma: PrismaService) {}

  async create(userId: string, createBookingDto: CreateBookingDto) {
    console.log(`📅 [BOOKING] Creating new booking - User: ${userId}, Space: ${createBookingDto.spaceId}, Date: ${createBookingDto.date}, Time: ${createBookingDto.startTime}-${createBookingDto.endTime}`);
    
    // Check if space exists
    const space = await this.prisma.space.findUnique({
      where: { id: createBookingDto.spaceId },
    });

    if (!space) {
      console.error(`❌ [BOOKING] Space not found: ${createBookingDto.spaceId}`);
      throw new NotFoundException(`Space with ID ${createBookingDto.spaceId} not found`);
    }

    // Check for time conflicts
    const conflictingBooking = await this.checkTimeConflict(
      createBookingDto.spaceId,
      createBookingDto.date,
      createBookingDto.startTime,
      createBookingDto.endTime,
    );

    if (conflictingBooking) {
      console.warn(`⚠️  [BOOKING] Time conflict detected - Space: ${createBookingDto.spaceId}, Date: ${createBookingDto.date}, Time: ${createBookingDto.startTime}-${createBookingDto.endTime}`);
      throw new BadRequestException('Time slot is already booked');
    }

    // Validate time range
    if (createBookingDto.startTime >= createBookingDto.endTime) {
      console.error(`❌ [BOOKING] Invalid time range - Start: ${createBookingDto.startTime}, End: ${createBookingDto.endTime}`);
      throw new BadRequestException('End time must be after start time');
    }

    // Create booking
    const booking = await this.prisma.booking.create({
      data: {
        userId,
        spaceId: createBookingDto.spaceId,
        date: new Date(createBookingDto.date),
        startTime: createBookingDto.startTime,
        endTime: createBookingDto.endTime,
        notes: createBookingDto.notes,
        status: 'pending',
      },
      include: {
        space: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    console.log(`✅ [BOOKING] Booking created successfully - ID: ${booking.id}, Status: ${booking.status}`);

    // Create notification for admin
    const admin = await this.prisma.user.findFirst({
      where: { role: 'admin' },
    });

    if (admin) {
      const notification = await this.prisma.notification.create({
        data: {
          userId: admin.id,
          title: 'New Booking Request',
          message: `New booking request for ${space.name}`,
          type: NotificationType.booking_request,
          bookingId: booking.id,
        },
      });
      console.log(`📬 [NOTIFICATION] Created notification for admin (${admin.email}): "${notification.title}" - Booking ID: ${booking.id}`);
    } else {
      console.warn('⚠️  [NOTIFICATION] No admin user found to notify about new booking');
    }

    return booking;
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
      // Filter by specific date (YYYY-MM-DD format)
      // Use UTC to avoid timezone conversion issues
      const startOfDay = new Date(date + 'T00:00:00.000Z');
      const endOfDay = new Date(date + 'T23:59:59.999Z');
      
      where.date = {
        gte: startOfDay,
        lte: endOfDay,
      };
      
      this.logger.log(`📅 [BOOKINGS] Filtering by date: ${date} -> ${startOfDay.toISOString()} to ${endOfDay.toISOString()}`);
    }

    const bookings = await this.prisma.booking.findMany({
      where,
      include: {
        space: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    this.logger.log(`📅 [BOOKINGS] Found ${bookings.length} bookings for filters: userId=${userId}, status=${status}, date=${date}`);
    
    return bookings;
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
      },
    });

    // Group by date and count
    const countsByDate: Record<string, number> = {};
    bookings.forEach((booking) => {
      const dateStr = booking.date.toISOString().split('T')[0]; // YYYY-MM-DD
      countsByDate[dateStr] = (countsByDate[dateStr] || 0) + 1;
    });

    return countsByDate;
  }

  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        space: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  async update(id: string, userId: string, userRole: string, updateBookingDto: UpdateBookingDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { space: true },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    // Only allow users to update their own bookings (unless admin)
    if (booking.userId !== userId && userRole !== 'admin') {
      throw new ForbiddenException('You can only update your own bookings');
    }

    // If status is being updated, only admin can do it
    if (updateBookingDto.status && userRole !== 'admin') {
      throw new ForbiddenException('Only admins can update booking status');
    }

    // Check for time conflicts if time is being updated
    if (updateBookingDto.startTime || updateBookingDto.endTime || updateBookingDto.date) {
      const date = updateBookingDto.date || booking.date.toISOString().split('T')[0];
      const startTime = updateBookingDto.startTime || booking.startTime;
      const endTime = updateBookingDto.endTime || booking.endTime;

      const conflictingBooking = await this.checkTimeConflict(
        booking.spaceId,
        date,
        startTime,
        endTime,
        id, // Exclude current booking
      );

      if (conflictingBooking) {
        throw new BadRequestException('Time slot is already booked');
      }
    }

    if (updateBookingDto.status && updateBookingDto.status !== booking.status) {
      console.log(`🔄 [BOOKING] Status update - Booking ID: ${id}, Old Status: ${booking.status}, New Status: ${updateBookingDto.status}`);
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id },
      data: {
        ...updateBookingDto,
        date: updateBookingDto.date ? new Date(updateBookingDto.date) : undefined,
      },
      include: {
        space: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    console.log(`✅ [BOOKING] Booking updated successfully - ID: ${id}`);

    // If status was updated, create notification for user
    if (updateBookingDto.status && updateBookingDto.status !== booking.status) {
      const notification = await this.prisma.notification.create({
        data: {
          userId: booking.userId,
          title: `Booking ${updateBookingDto.status}`,
          message: `Your booking for ${booking.space.name} has been ${updateBookingDto.status}`,
          type: NotificationType.status_update,
          bookingId: booking.id,
        },
      });
      console.log(`📬 [NOTIFICATION] Created status update notification for user (${booking.userId}): "${notification.title}" - Booking ID: ${booking.id}`);
    }

    return updatedBooking;
  }

  async remove(id: string, userId: string, userRole: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    // Only allow users to delete their own bookings (unless admin)
    if (booking.userId !== userId && userRole !== 'admin') {
      throw new ForbiddenException('You can only delete your own bookings');
    }

    await this.prisma.booking.delete({
      where: { id },
    });

    return { message: 'Booking deleted successfully' };
  }

  private async checkTimeConflict(
    spaceId: string,
    date: string,
    startTime: string,
    endTime: string,
    excludeBookingId?: string,
  ) {
    const where: any = {
      spaceId,
      date: new Date(date),
      status: {
        in: ['pending', 'approved'],
      },
      OR: [
        {
          AND: [
            { startTime: { lte: startTime } },
            { endTime: { gt: startTime } },
          ],
        },
        {
          AND: [
            { startTime: { lt: endTime } },
            { endTime: { gte: endTime } },
          ],
        },
        {
          AND: [
            { startTime: { gte: startTime } },
            { endTime: { lte: endTime } },
          ],
        },
      ],
    };

    if (excludeBookingId) {
      where.id = { not: excludeBookingId };
    }

    return this.prisma.booking.findFirst({
      where,
    });
  }
}

