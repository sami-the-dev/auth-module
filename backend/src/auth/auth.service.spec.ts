import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jest } from '@jest/globals';
import bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service.js';
import { AuthService } from './auth.service.js';

type Fn = (...args: any[]) => any;

describe('AuthService', () => {
  const users = { create: jest.fn<Fn>(), findByEmailWithPassword: jest.fn<Fn>() };
  const jwt = { signAsync: jest.fn<Fn>().mockResolvedValue('token') };
  const service = new AuthService(users as unknown as UsersService, jwt as unknown as JwtService);

  beforeEach(() => {
    users.create.mockReset();
    users.findByEmailWithPassword.mockReset();
  });

  it('hashes the password and returns a token on sign up', async () => {
    users.create.mockImplementation(async (d) => ({ id: '1', email: d.email, name: d.name }));
    const res = await service.signUp({ email: 'a@b.co', name: 'Abc', password: 'passw0rd!' });
    expect(users.create.mock.calls[0][0].passwordHash).not.toBe('passw0rd!');
    expect(res).toEqual({ user: { id: '1', email: 'a@b.co', name: 'Abc' }, accessToken: 'token' });
  });

  it('maps duplicate key errors to 409', async () => {
    users.create.mockRejectedValue({ code: 11000 });
    await expect(
      service.signUp({ email: 'a@b.co', name: 'Abc', password: 'passw0rd!' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('rejects wrong password and unknown email identically', async () => {
    users.findByEmailWithPassword.mockResolvedValueOnce({
      id: '1', email: 'a@b.co', name: 'Abc', passwordHash: await bcrypt.hash('right', 4),
    });
    await expect(service.signIn({ email: 'a@b.co', password: 'wrong' })).rejects.toBeInstanceOf(UnauthorizedException);
    users.findByEmailWithPassword.mockResolvedValueOnce(null);
    await expect(service.signIn({ email: 'x@y.co', password: 'wrong' })).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
