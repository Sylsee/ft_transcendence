import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create({
      ...createUserDto,
    });

    return await this.userRepository.save(newUser);
  }

  async find(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  findOneBy42Id(id42: number): Promise<UserEntity> {
    return this.userRepository.findOneBy({ id42: id42 });
  }

  findOneById(id: string): Promise<UserEntity> {
    return this.userRepository.findOneBy({ id: id });
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
