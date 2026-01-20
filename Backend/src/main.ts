import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enhanced request logging middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    const { method, originalUrl, ip, headers } = req;
    const userAgent = headers['user-agent']?.substring(0, 50) || 'unknown';
    const contentType = headers['content-type'] || 'N/A';

    // Log incoming request
    console.log(`\n🔵 [REQUEST] ${method} ${originalUrl} | From: ${ip || 'unknown'} | User-Agent: ${userAgent}...`);
    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      console.log(`   Content-Type: ${contentType}`);
    }

    res.on('finish', () => {
      const duration = Date.now() - start;
      const { statusCode } = res;
      const timestamp = new Date().toISOString();
      const logColor = statusCode >= 500 ? '\x1b[31m' : statusCode >= 400 ? '\x1b[33m' : '\x1b[32m';
      const resetColor = '\x1b[0m';

      console.log(
        `${logColor}🟢 [RESPONSE] ${method} ${originalUrl} ${statusCode}${resetColor} | ${duration}ms | ${timestamp}`
      );
    });

    next();
  });

  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5055',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('SpaceBook API')
    .setDescription('The SpaceBook booking system API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = parseInt(process.env.PORT || '4253', 10);

  // Get PrismaService reference for cleanup (PrismaService will auto-disconnect via OnModuleDestroy)
  const prismaService = app.get(PrismaService);

  // Enable NestJS graceful shutdown hooks (handles SIGTERM and SIGINT automatically)
  app.enableShutdownHooks();

  await app.listen(port);
  console.log(`🚀 Backend server running on http://localhost:${port}`);
  console.log(`📚 API docs available at http://localhost:${port}/api/docs`);
  console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5055'}`);
  console.log(`📊 Request logging enabled - you'll see all incoming requests below:\n`);
  console.log(`🔧 Configuration: PORT=${port} (from ${process.env.PORT ? 'environment' : 'default'})\n`);
  console.log(`💡 Press Ctrl+C to gracefully stop the server\n`);

  // Additional graceful shutdown for SIGHUP (terminal disconnection) and errors
  const gracefulShutdown = async (signal: string) => {
    console.log(`\n⚠️  ${signal} received. Starting graceful shutdown...`);
    try {
      // app.close() triggers NestJS lifecycle hooks including PrismaService.onModuleDestroy
      await app.close();
      // Extra safety: ensure Prisma is disconnected
      await prismaService.$disconnect().catch(() => { });
      console.log('✅ Graceful shutdown completed. Port 4253 is now free.');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
      process.exit(1);
    }
  };

  // Handle SIGHUP (terminal disconnection) - not handled by NestJS by default
  process.on('SIGHUP', () => gracefulShutdown('SIGHUP'));

  // Handle uncaught exceptions (critical errors)
  process.on('uncaughtException', async (error) => {
    console.error('❌ Uncaught Exception:', error);
    await gracefulShutdown('uncaughtException');
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', async (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    await gracefulShutdown('unhandledRejection');
  });

  // Log when process exits (cleanup confirmation)
  process.on('exit', (code) => {
    if (code !== 0) {
      console.log(`\n🔴 Process exiting with code ${code}`);
    }
  });
}
bootstrap();

