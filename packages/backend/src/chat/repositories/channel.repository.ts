// NestJS imports
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Third-party imports
import { Repository } from 'typeorm';

// Local imports
import { UserEntity } from 'src/user/entities/user.entity';
import { ChannelEntity } from '../entities/channel.entity';
import { ChannelType } from '../enum/channel-type.enum';

@Injectable()
export class ChannelRepository {
  private readonly logger: Logger = new Logger(ChannelRepository.name);

  constructor(
    @InjectRepository(ChannelEntity)
    private channelRepository: Repository<ChannelEntity>,
  ) {}

  async create(
    name: string,
    owner: UserEntity,
    admins: UserEntity[],
    users: UserEntity[],
    type?: ChannelType,
    password?: string,
  ): Promise<ChannelEntity> {
    const newChannel = new ChannelEntity();
    newChannel.name = name;
    newChannel.owner = owner;
    newChannel.admins = admins;
    newChannel.users = users;
    newChannel.type = type;
    newChannel.password = password;

    return this.channelRepository.save(newChannel);
  }

  async save(channel: ChannelEntity): Promise<ChannelEntity> {
    return this.channelRepository.save(channel);
  }

  async delete(channel: ChannelEntity | string): Promise<void> {
    if (typeof channel === 'string') {
      this.channelRepository.delete(channel);
    } else {
      this.channelRepository.delete(channel.id);
    }
  }

  async findWithRelations(
    relations: string[],
  ): Promise<ChannelEntity[] | void> {
    return this.channelRepository
      .find({ relations: relations })
      .catch((err) => {
        this.logger.error(
          `Error when finding channels with relations: ${relations}`,
          err,
        );
      });
  }

  async findDmChannel(
    userId1: string,
    userId2: string,
  ): Promise<ChannelEntity[] | void> {
    return this.channelRepository
      .createQueryBuilder('channel')
      .innerJoin('channel.users', 'user')
      .where('channel.type = :type', { type: ChannelType.DIRECT_MESSAGE })
      .andWhere('user.id IN (:...userIds)', { userIds: [userId1, userId2] })
      .groupBy('channel.id')
      .having('COUNT(channel.id) = :count', { count: 2 })
      .getMany()
      .catch((err) => {
        this.logger.error(
          `Error when finding direct message channel between users: ${userId1} and ${userId2}`,
          err,
        );
      });
  }

  async findUserInChannelByName(
    channelId: string,
    username: string,
  ): Promise<UserEntity | void> {
    return this.channelRepository
      .createQueryBuilder('channel')
      .leftJoinAndSelect('channel.users', 'user')
      .where('channel.id = :channelId', { channelId })
      .andWhere('user.name = :username', { username })
      .getOne()
      .then((channel) => channel?.users.find((user) => user.name === username))
      .catch((err) => {
        this.logger.error(
          `Error when finding user in channel: ${channelId} with name: ${username}`,
          err,
        );
      });
  }

  async findAvailableChannels(userId: string): Promise<ChannelEntity[] | void> {
    try {
      // Query builder for selecting channels
      const channelQueryBuilder = this.channelRepository
        .createQueryBuilder('channel')
        .leftJoinAndSelect('channel.users', 'user')
        .leftJoinAndSelect('channel.admins', 'admin')
        .leftJoinAndSelect('channel.invitedUsers', 'invitedUser')
        .leftJoinAndSelect('channel.banUsers', 'banUser')
        .leftJoinAndSelect('channel.owner', 'owner')
        .where('channel.type NOT IN (:...channelTypes)', {
          channelTypes: [ChannelType.PRIVATE, ChannelType.DIRECT_MESSAGE],
        })
        .andWhere('banUser.id IS NULL OR banUser.id != :userId', { userId });

      // Query builder for selecting channels with direct messages
      const dmChannelsQueryBuilder = this.channelRepository
        .createQueryBuilder()
        .select('channel_users."channelId"')
        .from('channel_users', 'channel_users')
        .where('channel_users."userId" = :userId', { userId });

      // Add the private and direct message channels condition
      channelQueryBuilder.orWhere(
        '(channel.type = :privateType AND (user.id = :userId OR invitedUser.id = :userId)) OR (channel.type = :dmType AND channel.id IN (' +
          dmChannelsQueryBuilder.getQuery() +
          '))',
        {
          privateType: ChannelType.PRIVATE,
          dmType: ChannelType.DIRECT_MESSAGE,
          userId,
        },
      );

      // Execute the final query
      return await channelQueryBuilder.getMany();
    } catch (error) {
      this.logger.error(error);
    }
  }

  async findOneByIdWithRelations(
    id: string,
    relations: string[],
  ): Promise<ChannelEntity | void> {
    return this.channelRepository
      .findOne({ where: { id: id }, relations: relations })
      .catch((error) => {
        this.logger.error(error);
      });
  }
}
