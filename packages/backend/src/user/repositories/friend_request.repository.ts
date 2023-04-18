// NestJS imports
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Third-party imports
import { Repository } from 'typeorm';

// Local files
import { FriendRequest } from '../entities/friend_request.entity';

@Injectable()
export class FriendRequestRepository {
  private readonly logger = new Logger(FriendRequestRepository.name);

  constructor(
    @InjectRepository(FriendRequest)
    private friendRequestRepository: Repository<FriendRequest>,
  ) {}

  async findOneById(id: string): Promise<FriendRequest | void> {
    try {
      return this.friendRequestRepository.findOneBy({ id: id });
    } catch (error) {
      this.logger.error(error);
    }
  }

  async findSpecifyFriendRequest(
    receiverId: string,
    senderId: string,
  ): Promise<FriendRequest | void> {
    try {
      return await this.friendRequestRepository
        .createQueryBuilder('req')
        .leftJoinAndSelect('req.sender', 'sender')
        .leftJoinAndSelect('req.receiver', 'receiver')
        .where('req.receiverId = :receiverId', { receiverId: receiverId })
        .andWhere('req.senderId = :senderId', { senderId: senderId })
        .getOne();
    } catch (error) {
      this.logger.error(error);
    }
  }

  async findPossibleFriendRequest(
    firstId: string,
    secondId: string,
  ): Promise<FriendRequest | void> {
    try {
      return this.friendRequestRepository
        .createQueryBuilder('req')
        .leftJoinAndSelect('req.sender', 'sender')
        .leftJoinAndSelect('req.receiver', 'receiver')
        .where('req.receiverId = :receiverId1 AND req.senderId = :senderId1', {
          receiverId1: firstId,
          senderId1: secondId,
        })
        .orWhere(
          'req.receiverId = :receiverId2 AND req.senderId = :senderId2',
          {
            receiverId2: secondId,
            senderId2: firstId,
          },
        )
        .getOne();
    } catch (error) {
      this.logger.error(error);
    }
  }

  saveFriendRequest(newFriendRequest: FriendRequest): Promise<FriendRequest> {
    return this.friendRequestRepository.save(newFriendRequest);
  }

  deleteFriendRequest(friendRequest: FriendRequest) {
    this.friendRequestRepository.delete(friendRequest);
  }
}
