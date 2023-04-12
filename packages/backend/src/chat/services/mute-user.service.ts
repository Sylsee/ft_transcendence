// NestJS imports
import { Injectable } from '@nestjs/common';

// Local imports
import { UserEntity } from 'src/user/entities/user.entity';
import { ChannelEntity } from '../entities/channel.entity';
import { MuteUserEntity } from '../entities/mute-user.entity';
import { MuteUserRepository } from '../repositories/mute-user.repository';

@Injectable()
export class MuteUserService {
  constructor(private muteUserRepository: MuteUserRepository) {}

  async create(
    user: UserEntity,
    channel: ChannelEntity,
    muteEndTime: Date,
  ): Promise<MuteUserEntity> {
    return await this.muteUserRepository.create(user, channel, muteEndTime);
  }

  async delete(user: string | MuteUserEntity): Promise<void> {
    if (typeof user === 'string') {
      const deleteUser = await this.muteUserRepository.findOneById(user);

      if (deleteUser) {
        this.muteUserRepository.delete(deleteUser);
      }
    } else if (user instanceof MuteUserEntity) {
      this.muteUserRepository.delete(user);
    }
  }

  async isUserMuteInChannel(
    userId: string,
    channelId: string,
  ): Promise<boolean> {
    return this.muteUserRepository.isUserMuteInChannel(userId, channelId);
  }
}
