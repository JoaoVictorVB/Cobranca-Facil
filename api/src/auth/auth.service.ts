import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const match = await bcrypt.compare(pass, user.password);
    if (match) return user;
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email };
    return { accessToken: this.jwtService.sign(payload) };
  }

  async register(email: string, password: string, name?: string) {
    const exists = await this.usersService.findByEmail(email);
    if (exists) throw new UnauthorizedException('Email already in use');
    const created = await this.usersService.createUser(email, password, name);
    return this.login(created);
  }
}
