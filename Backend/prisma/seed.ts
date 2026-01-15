import { PrismaClient, SpaceType, UserRole, BookingStatus, NotificationType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.space.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@spacebook.com',
      password: adminPassword,
      role: UserRole.admin,
      avatar: '/admin-user-avatar.png',
    },
  });
  console.log('✅ Created admin user:', admin.email);

  // Create regular users
  const user1Password = await bcrypt.hash('password123', 10);
  const user1 = await prisma.user.create({
    data: {
      name: 'John Smith',
      email: 'john.smith@example.com',
      password: user1Password,
      role: UserRole.user,
      avatar: '/professional-man-avatar.png',
    },
  });

  const user2Password = await bcrypt.hash('password123', 10);
  const user2 = await prisma.user.create({
    data: {
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      password: user2Password,
      role: UserRole.user,
      avatar: '/professional-woman-avatar.png',
    },
  });

  const user3Password = await bcrypt.hash('password123', 10);
  const user3 = await prisma.user.create({
    data: {
      name: 'Mike Davis',
      email: 'mike.d@example.com',
      password: user3Password,
      role: UserRole.user,
      avatar: '/confident-businessman.png',
    },
  });
  console.log('✅ Created users');

  // Create spaces
  const spaces = await Promise.all([
    prisma.space.create({
      data: {
        name: 'Main Auditorium',
        type: SpaceType.auditorium,
        capacity: 500,
        description: 'Large auditorium with state-of-the-art sound system and lighting',
        image: '/modern-auditorium-interior.jpg',
      },
    }),
    prisma.space.create({
      data: {
        name: 'Multipurpose Gym',
        type: SpaceType.gym,
        capacity: 200,
        description: 'Versatile gymnasium suitable for basketball, volleyball, and events',
        image: '/indoor-gymnasium-sports-facility.jpg',
      },
    }),
    prisma.space.create({
      data: {
        name: 'Soccer Field A',
        type: SpaceType.soccer,
        capacity: 50,
        description: 'Professional-grade natural grass soccer field',
        image: '/soccer-field-at-sunset.jpg',
      },
    }),
    prisma.space.create({
      data: {
        name: 'Soccer Field B',
        type: SpaceType.soccer,
        capacity: 50,
        description: 'Synthetic turf field with lighting for night games',
        image: '/artificial-turf-soccer-field.png',
      },
    }),
    prisma.space.create({
      data: {
        name: 'Soccer Field C',
        type: SpaceType.soccer,
        capacity: 40,
        description: 'Training field ideal for practice sessions',
        image: '/soccer-training-field.jpg',
      },
    }),
    prisma.space.create({
      data: {
        name: 'Soccer Field D',
        type: SpaceType.soccer,
        capacity: 40,
        description: 'Indoor soccer field with climate control',
        image: '/indoor-soccer-field-arena.jpg',
      },
    }),
  ]);
  console.log('✅ Created spaces');

  // Create bookings
  const today = new Date();
  const bookings = await Promise.all([
    prisma.booking.create({
      data: {
        userId: user1.id,
        spaceId: spaces[0].id,
        date: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        startTime: '09:00',
        endTime: '12:00',
        status: BookingStatus.approved,
        notes: 'Company annual meeting',
      },
    }),
    prisma.booking.create({
      data: {
        userId: user2.id,
        spaceId: spaces[1].id,
        date: new Date(today.getTime() + 11 * 24 * 60 * 60 * 1000), // 11 days from now
        startTime: '14:00',
        endTime: '17:00',
        status: BookingStatus.pending,
        notes: 'Basketball tournament',
      },
    }),
    prisma.booking.create({
      data: {
        userId: user1.id,
        spaceId: spaces[2].id,
        date: new Date(today.getTime() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
        startTime: '10:00',
        endTime: '12:00',
        status: BookingStatus.approved,
      },
    }),
    prisma.booking.create({
      data: {
        userId: user3.id,
        spaceId: spaces[3].id,
        date: new Date(today.getTime() + 13 * 24 * 60 * 60 * 1000), // 13 days from now
        startTime: '16:00',
        endTime: '18:00',
        status: BookingStatus.rejected,
        notes: 'Soccer practice',
      },
    }),
    prisma.booking.create({
      data: {
        userId: user2.id,
        spaceId: spaces[0].id,
        date: new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        startTime: '13:00',
        endTime: '16:00',
        status: BookingStatus.pending,
        notes: 'Product launch event',
      },
    }),
  ]);
  console.log('✅ Created bookings');

  // Create notifications
  await Promise.all([
    prisma.notification.create({
      data: {
        userId: admin.id,
        title: 'New Booking Request',
        message: 'Sarah Johnson requested the Multipurpose Gym',
        type: NotificationType.booking_request,
        read: false,
        bookingId: bookings[1].id,
      },
    }),
    prisma.notification.create({
      data: {
        userId: admin.id,
        title: 'New Booking Request',
        message: 'Sarah Johnson requested the Main Auditorium',
        type: NotificationType.booking_request,
        read: false,
        bookingId: bookings[4].id,
      },
    }),
    prisma.notification.create({
      data: {
        userId: user1.id,
        title: 'Booking Approved',
        message: 'Your booking for Main Auditorium has been approved',
        type: NotificationType.status_update,
        read: false,
        bookingId: bookings[0].id,
      },
    }),
    prisma.notification.create({
      data: {
        userId: user3.id,
        title: 'Booking Rejected',
        message: 'Your booking for Soccer Field B was rejected',
        type: NotificationType.status_update,
        read: true,
        bookingId: bookings[3].id,
      },
    }),
  ]);
  console.log('✅ Created notifications');

  console.log('🎉 Seed completed successfully!');
  console.log('\n📝 Test credentials:');
  console.log('Admin: admin@spacebook.com / admin123');
  console.log('User: john.smith@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });














