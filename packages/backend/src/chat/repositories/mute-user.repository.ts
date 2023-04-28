// NestJS imports
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Third-party imports
import { Repository } from 'typeorm';

// Local imports
import { UserEntity } from 'src/user/entities/user.entity';
import { ChannelEntity } from '../entities/channel.entity';
import { MuteUserEntity } from '../entities/mute-user.entity';

@Injectable()
export class MuteUserRepository {
  private readonly logger = new Logger(MuteUserRepository.name);

  constructor(
    @InjectRepository(MuteUserEntity)
    private muteUserRepository: Repository<MuteUserEntity>,
  ) {}

  async create(
    user: UserEntity,
    channel: ChannelEntity,
    muteEndTime: Date,
  ): Promise<MuteUserEntity> {
    const newMuteUser = new MuteUserEntity();
    newMuteUser.user = user;
    newMuteUser.channel = channel;
    newMuteUser.muteEndTime = muteEndTime;

    return this.muteUserRepository.save(newMuteUser);
  }

  async delete(user: MuteUserEntity): Promise<void> {
    this.muteUserRepository.remove(user);
  }

  async findOneByUserIdAndChannelId(
    userId: string,
    channelId: string,
  ): Promise<MuteUserEntity | void> {
    return this.muteUserRepository
      .createQueryBuilder('muteUser')
      .innerJoinAndSelect('muteUser.user', 'user')
      .innerJoinAndSelect('muteUser.channel', 'channel')
      .where('user.id = :userId', { userId })
      .andWhere('channel.id = :channelId', { channelId })
      .getOne()
      .catch((error) => {
        this.logger.error(error);
      });
  }

  async isUserMuteInChannel(
    userId: string,
    channelId: string,
  ): Promise<boolean> {
    const currentTime = new Date();

    const muteUser = await this.muteUserRepository
      .createQueryBuilder('muteUser')
      .innerJoinAndSelect('muteUser.user', 'user')
      .innerJoinAndSelect('muteUser.channel', 'channel')
      .where('user.id = :userId', { userId })
      .andWhere('channel.id = :channelId', { channelId })
      .andWhere('muteUser.muteEndTime > :currentTime', { currentTime })
      .getOne()
      .catch((error) => {
        this.logger.error(error);
      });

    return !!muteUser;
  }
}
