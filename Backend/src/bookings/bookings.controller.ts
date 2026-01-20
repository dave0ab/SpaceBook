import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserRole, BookingStatus } from '@prisma/client';

@ApiTags('bookings')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  @ApiResponse({ status: 400, description: 'Time slot conflict or invalid data' })
  create(@GetUser() user: any, @Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(user.id, createBookingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bookings' })
  @ApiQuery({ name: 'status', required: false, enum: BookingStatus, description: 'Filter by status' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID (Admin only)' })
  @ApiQuery({ name: 'date', required: false, description: 'Filter by date (YYYY-MM-DD format)' })
  @ApiResponse({ status: 200, description: 'List of bookings' })
  findAll(
    @GetUser() user: any,
    @Query('status') status?: BookingStatus,
    @Query('userId') userId?: string,
    @Query('date') date?: string,
  ) {
    // If not admin, only show their own bookings
    const filterUserId = user.role === 'admin' ? userId : user.id;
    return this.bookingsService.findAll(filterUserId, status, date);
  }

  @Get('counts')
  @ApiOperation({ summary: 'Get booking counts grouped by date' })
  @ApiQuery({ name: 'startDate', required: true, description: 'Start date (YYYY-MM-DD format)' })
  @ApiQuery({ name: 'endDate', required: true, description: 'End date (YYYY-MM-DD format)' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Booking counts by date' })
  async getCounts(
    @GetUser() user: any,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('userId') userId?: string,
  ) {
    const filterUserId = user.role === 'admin' ? userId : user.id;
    return this.bookingsService.getCountsByDate(filterUserId, startDate, endDate);
  }

  @Get('statistics/by-user')
  @UseGuards(RolesGuard)
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'Get booking statistics grouped by user (Admin only)' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (YYYY-MM-DD format)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (YYYY-MM-DD format)' })
  @ApiQuery({ name: 'status', required: false, enum: BookingStatus, description: 'Filter by status' })
  @ApiResponse({ status: 200, description: 'Booking statistics by user' })
  async getBookingsByUser(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('status') status?: BookingStatus,
  ) {
    return this.bookingsService.getBookingsByUser(startDate, endDate, status);
  }

  @Get('statistics/by-space')
  @UseGuards(RolesGuard)
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'Get booking statistics grouped by space (Admin only)' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (YYYY-MM-DD format)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (YYYY-MM-DD format)' })
  @ApiQuery({ name: 'status', required: false, enum: BookingStatus, description: 'Filter by status' })
  @ApiResponse({ status: 200, description: 'Booking statistics by space' })
  async getBookingsBySpace(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('status') status?: BookingStatus,
  ) {
    return this.bookingsService.getBookingsBySpace(startDate, endDate, status);
  }

  @Get('statistics/approved-by-date')
  @UseGuards(RolesGuard)
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'Get approved reservations grouped by date (Admin only)' })
  @ApiQuery({ name: 'startDate', required: true, description: 'Start date (YYYY-MM-DD format)' })
  @ApiQuery({ name: 'endDate', required: true, description: 'End date (YYYY-MM-DD format)' })
  @ApiResponse({ status: 200, description: 'Approved reservations by date' })
  async getApprovedReservationsByDate(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.bookingsService.getApprovedReservationsByDate(startDate, endDate);
  }

  @Get('statistics/rejected-by-date')
  @UseGuards(RolesGuard)
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'Get rejected reservations grouped by date (Admin only)' })
  @ApiQuery({ name: 'startDate', required: true, description: 'Start date (YYYY-MM-DD format)' })
  @ApiQuery({ name: 'endDate', required: true, description: 'End date (YYYY-MM-DD format)' })
  @ApiResponse({ status: 200, description: 'Rejected reservations by date' })
  async getRejectedReservationsByDate(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.bookingsService.getRejectedReservationsByDate(startDate, endDate);
  }

  @Get('statistics/rejected-by-user')
  @UseGuards(RolesGuard)
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'Get rejected reservations grouped by user (Admin only)' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (YYYY-MM-DD format)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (YYYY-MM-DD format)' })
  @ApiResponse({ status: 200, description: 'Rejected reservations by user' })
  async getRejectedReservationsByUser(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.bookingsService.getRejectedReservationsByUser(startDate, endDate);
  }

  @Get('statistics/by-user-detailed')
  @UseGuards(RolesGuard)
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'Get detailed booking statistics by user with status breakdown (Admin only)' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (YYYY-MM-DD format)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (YYYY-MM-DD format)' })
  @ApiResponse({ status: 200, description: 'Detailed booking statistics by user' })
  async getBookingsByUserDetailed(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.bookingsService.getBookingsByUserDetailed(startDate, endDate);
  }

  @Get('statistics/by-space-detailed')
  @UseGuards(RolesGuard)
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'Get detailed booking statistics by space with status breakdown (Admin only)' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (YYYY-MM-DD format)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (YYYY-MM-DD format)' })
  @ApiResponse({ status: 200, description: 'Detailed booking statistics by space' })
  async getBookingsBySpaceDetailed(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.bookingsService.getBookingsBySpaceDetailed(startDate, endDate);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a booking by ID' })
  @ApiResponse({ status: 200, description: 'Booking found' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a booking' })
  @ApiResponse({ status: 200, description: 'Booking updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  update(
    @Param('id') id: string,
    @GetUser() user: any,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return this.bookingsService.update(id, user.id, user.role, updateBookingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a booking' })
  @ApiResponse({ status: 200, description: 'Booking deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  remove(@Param('id') id: string, @GetUser() user: any) {
    return this.bookingsService.remove(id, user.id, user.role);
  }
}

