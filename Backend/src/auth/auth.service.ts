import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    console.log(`🔐 [AUTH] Registration attempt - Email: ${registerDto.email}, Role: ${registerDto.role || 'user'}`);
    
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      console.warn(`⚠️  [AUTH] Registration failed - Email already exists: ${registerDto.email}`);
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: registerDto.name,
        email: registerDto.email,
        password: hashedPassword,
        role: registerDto.role || 'user',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        avatar: true,
        createdAt: true,
      },
    });

    console.log(`✅ [AUTH] User registered successfully - ID: ${user.id}, Email: ${user.email}, Role: ${user.role}`);

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return {
      user,
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    console.log(`🔐 [AUTH] Login attempt - Email: ${loginDto.email}`);
    
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      console.warn(`⚠️  [AUTH] Login failed - User not found: ${loginDto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status === 'inactive') {
      console.warn(`⚠️  [AUTH] Login failed - Account inactive: ${loginDto.email}`);
      throw new UnauthorizedException('Account is inactive');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      console.warn(`⚠️  [AUTH] Login failed - Invalid password: ${loginDto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    console.log(`✅ [AUTH] User logged in successfully - ID: ${user.id}, Email: ${user.email}, Role: ${user.role}`);

    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      ...tokens,
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      console.log(`🔄 [AUTH] Token refresh attempt`);
      
      const payload = this.jwtService.verify(refreshTokenDto.refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const refreshTokenRecord = await this.prisma.refreshToken.findUnique({
        where: { token: refreshTokenDto.refreshToken },
      });

      if (!refreshTokenRecord || refreshTokenRecord.expiresAt < new Date()) {
        console.warn(`⚠️  [AUTH] Token refresh failed - Invalid or expired refresh token`);
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          avatar: true,
        },
      });

      if (!user || user.status === 'inactive') {
        console.warn(`⚠️  [AUTH] Token refresh failed - User not found or inactive: ${payload.sub}`);
        throw new UnauthorizedException('User not found or inactive');
      }

      const tokens = await this.generateTokens(user.id, user.email, user.role);
      await this.deleteRefreshToken(refreshTokenDto.refreshToken);
      await this.saveRefreshToken(user.id, tokens.refreshToken);

      console.log(`✅ [AUTH] Token refreshed successfully - User ID: ${user.id}, Email: ${user.email}`);

      return {
        user,
        ...tokens,
      };
    } catch (error) {
      console.error(`❌ [AUTH] Token refresh failed:`, error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(refreshToken: string) {
    console.log(`🚪 [AUTH] Logout attempt`);
    await this.deleteRefreshToken(refreshToken);
    console.log(`✅ [AUTH] User logged out successfully`);
    return { message: 'Logged out successfully' };
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async saveRefreshToken(userId: string, token: string) {
    const expiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d';
    const expiresAt = new Date();
    
    // Parse duration (e.g., "7d" = 7 days, "30d" = 30 days)
    const daysMatch = expiresIn.match(/(\d+)d/);
    if (daysMatch) {
      expiresAt.setDate(expiresAt.getDate() + parseInt(daysMatch[1], 10));
    } else {
      // Default to 7 days if format is unrecognized
      expiresAt.setDate(expiresAt.getDate() + 7);
    }

    await this.prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  private async deleteRefreshToken(token: string) {
    await this.prisma.refreshToken.deleteMany({
      where: { token },
    });
  }
}

