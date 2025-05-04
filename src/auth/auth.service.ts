import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto, res: Response) {
    try {
      const defaultRole = await this.prisma.role.findFirst({
        where: { isDefault: true },
      });

      if (!defaultRole) {
        throw new NotFoundException('Default role is not found.');
      }

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: dto.password,
          firstName: dto.firstName,
          lastName: dto.lastName,
          phoneNumber: dto.phoneNumber,
          dateOfBirth: dto.dateOfBirth,
          roleId: defaultRole.id,
        },
      });

      await this.signToken(user.id, user.email, res);

      return { message: 'Registered successfully' };
    } catch (error) {
      if (error?.code === 'P2002') {
        throw new ForbiddenException('Credentials taken');
      }
      throw error;
    }
  }

  async login(dto: LoginDto, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('Credentials incorrect');

    if (dto.password !== user.password)
      throw new ForbiddenException('Credentials incorrect');

    await this.signToken(user.id, user.email, res);

    return { message: 'Logged in successfully' };
  }

  async signToken(userId: string, email: string, res: Response): Promise<void> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: '30min',
      secret,
    });

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: this.config.get('NODE_ENV') === 'production',
      sameSite: 'lax',
      maxAge: 30 * 60 * 1000,
    });
  }
}
