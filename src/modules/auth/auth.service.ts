import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { compare } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginDto) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Wrong email or password');
    }

    const comparePassword = compare(password, user.password);

    if (!comparePassword) {
      throw new UnauthorizedException('Wrong email or password');
    }

    const token = this.jwtService.sign({ email }, { subject: user.id });

    return { token };
  }
}
