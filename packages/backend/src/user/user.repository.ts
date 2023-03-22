import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create({
      ...createUserDto,
    });

    return await this.userRepository.save(newUser);
  }

  async find(): Promise<User[]> {
    return await this.userRepository.find();
  }

  findOneBy42Id(id42: number): Promise<User> {
    return this.userRepository.findOneBy({ id42: id42 });
  }

  findOneById(id: string): Promise<User> {
    return this.userRepository.findOneBy({ id: id });
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
