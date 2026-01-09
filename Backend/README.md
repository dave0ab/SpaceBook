# SpaceBook Backend API

Backend API for the SpaceBook booking system built with NestJS, PostgreSQL, and Prisma.

## Tech Stack

- **Framework**: NestJS 10
- **Database**: PostgreSQL
- **ORM**: Prisma 5
- **Language**: TypeScript
- **Authentication**: JWT with refresh tokens
- **API Documentation**: Swagger/OpenAPI

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/spacebook?schema=public"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-in-production-min-32-chars"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production-min-32-chars"
JWT_REFRESH_EXPIRES_IN="7d"

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5055
```

### 3. Database Setup

Generate Prisma Client:

```bash
npm run prisma:generate
```

Run database migrations:

```bash
npm run prisma:migrate
```

Seed the database with initial data:

```bash
npm run prisma:seed
```

This will create:
- Admin user: `admin@spacebook.com` / `admin123`
- Test users: `john.smith@example.com` / `password123`

### 4. Start Development Server

```bash
npm run start:dev
```

The server will start on `http://localhost:3001` and API documentation will be available at `http://localhost:3001/api/docs`.

## Available Scripts

- `npm run build` - Build the application
- `npm run start` - Start production server
- `npm run start:dev` - Start development server with hot reload
- `npm run start:debug` - Start with debug mode
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
- `npm run prisma:seed` - Seed the database

## API Endpoints

### Authentication (`/api/auth`)

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Users (`/api/users`)

- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user (Admin only)
- `PATCH /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

### Spaces (`/api/spaces`)

- `GET /api/spaces` - Get all spaces
- `GET /api/spaces?type=auditorium` - Get spaces by type
- `GET /api/spaces/:id` - Get space by ID
- `POST /api/spaces` - Create space (Admin only)
- `PATCH /api/spaces/:id` - Update space (Admin only)
- `DELETE /api/spaces/:id` - Delete space (Admin only)

### Bookings (`/api/bookings`)

- `GET /api/bookings` - Get all bookings (user's own bookings, or all if admin)
- `GET /api/bookings?status=pending` - Filter bookings by status
- `GET /api/bookings/:id` - Get booking by ID
- `POST /api/bookings` - Create a new booking
- `PATCH /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking

### Notifications (`/api/notifications`)

- `GET /api/notifications` - Get all notifications for current user
- `GET /api/notifications/unread` - Get unread notifications
- `GET /api/notifications/unread/count` - Get unread count
- `GET /api/notifications/:id` - Get notification by ID
- `PATCH /api/notifications/:id/read` - Mark notification as read
- `PATCH /api/notifications/read/all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

## Authentication

The API uses JWT authentication. Include the access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Database Schema

- **User**: Users (admin/regular) with authentication
- **Space**: Available spaces (auditorium, gym, soccer)
- **Booking**: Booking requests with status (pending/approved/rejected)
- **Notification**: Notifications for users and admins
- **RefreshToken**: Refresh tokens for JWT authentication

## API Documentation

Once the server is running, visit `http://localhost:3001/api/docs` to see the interactive Swagger documentation.

## Project Structure

```
src/
├── auth/           # Authentication module (JWT, guards, strategies)
├── users/          # Users module
├── spaces/         # Spaces module
├── bookings/       # Bookings module
├── notifications/  # Notifications module
├── prisma/         # Prisma service and module
├── app.module.ts   # Root module
└── main.ts         # Application entry point

prisma/
├── schema.prisma   # Database schema
└── seed.ts         # Database seed script
```

## Features

- ✅ JWT authentication with refresh tokens
- ✅ Role-based access control (Admin/User)
- ✅ Booking conflict detection
- ✅ Automated notifications
- ✅ Comprehensive API documentation
- ✅ Input validation
- ✅ Error handling
- ✅ Type-safe database queries with Prisma

## License

MIT

