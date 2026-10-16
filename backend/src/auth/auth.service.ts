import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service.js';
import { SignInDto } from './dto/signin.dto.js';
import { SignUpDto } from './dto/signup.dto.js';

const BCRYPT_ROUNDS = 12;
// Pre-computed hash so unknown-email sign-ins cost the same as wrong-password ones.
const DUMMY_HASH = bcrypt.hashSync('dummy-password', BCRYPT_ROUNDS);

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async signUp(dto: SignUpDto) {
    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    try {
      const user = await this.users.create({ email: dto.email, name: dto.name, passwordHash });
      return this.buildResponse(user.id, user.email, user.name);
    } catch (err) {
      if ((err as { code?: number }).code === 11000) {
        throw new ConflictException('An account with this email already exists');
      }
      throw err;
    }
  }

  async signIn(dto: SignInDto) {
    const user = await this.users.findByEmailWithPassword(dto.email);
    const valid = await bcrypt.compare(dto.password, user?.passwordHash ?? DUMMY_HASH);
    if (!user || !valid) throw new UnauthorizedException('Invalid credentials');
    return this.buildResponse(user.id, user.email, user.name);
  }

  private async buildResponse(id: string, email: string, name: string) {
    const accessToken = await this.jwt.signAsync({ sub: id, email });
    return { user: { id, email, name }, accessToken };
  }
}
