import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema.js';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
}

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly model: Model<UserDocument>) {}

  create(data: { email: string; name: string; passwordHash: string }) {
    return this.model.create(data);
  }

  findById(id: string) {
    return this.model.findById(id).exec();
  }

  async getProfile(id: string): Promise<UserProfile> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return { id: user.id, email: user.email, name: user.name };
  }

  findByEmailWithPassword(email: string) {
    return this.model.findOne({ email: email.toLowerCase() }).select('+passwordHash').exec();
  }
}
