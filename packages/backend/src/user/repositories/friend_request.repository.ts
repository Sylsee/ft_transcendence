// NestJS imports
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Third-party imports
import { Repository } from 'typeorm';

// Local imports
import { FriendRequest } from '../entities/friend_request.entity';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class FriendRequestRepository {
  private readonly logger: Logger = new Logger(FriendRequestRepository.name);

  constructor(
    @InjectRepository(FriendRequest)
    private friendRequestRepository: Repository<FriendRequest>,
  ) {}

  async create(
    sender: UserEntity,
    receiver: UserEntity,
  ): Promise<FriendRequest> {
    const newRequest = new FriendRequest();
    newRequest.receiver = receiver;
    newRequest.sender = sender;

    return this.friendRequestRepository.save(newRequest);
  }

  save(newFriendRequest: FriendRequest): Promise<FriendRequest> {
    return this.friendRequestRepository.save(newFriendRequest);
  }

  async delete(senderId: string, receiverId: string): Promise<any> {
    return await this.friendRequestRepository
      .createQueryBuilder()
      .delete()
      .from(FriendRequest)
      .where('senderId = :senderId', { senderId })
      .andWhere('receiverId = :receiverId', { receiverId })
      .execute();
  }

  async findOneById(id: string): Promise<FriendRequest | void> {
    return this.friendRequestRepository.findOneBy({ id: id }).catch((error) => {
      this.logger.error(error);
    });
  }

  async findFriendRequest(
    senderId: string,
    receiverId: string,
  ): Promise<FriendRequest | void> {
    return this.friendRequestRepository
      .createQueryBuilder('req')
      .leftJoinAndSelect('req.sender', 'sender')
      .leftJoinAndSelect('req.receiver', 'receiver')
      .where('req.receiverId = :receiverId', { receiverId: receiverId })
      .andWhere('req.senderId = :senderId', { senderId: senderId })
      .getOne()
      .catch((error) => {
        this.logger.error(error);
      });
  }

  async findPossibleFriendRequest(
    firstId: string,
    secondId: string,
  ): Promise<FriendRequest | void> {
    return this.friendRequestRepository
      .createQueryBuilder('req')
      .leftJoinAndSelect('req.sender', 'sender')
      .leftJoinAndSelect('req.receiver', 'receiver')
      .where('req.receiverId = :receiverId1 AND req.senderId = :senderId1', {
        receiverId1: firstId,
        senderId1: secondId,
      })
      .orWhere('req.receiverId = :receiverId2 AND req.senderId = :senderId2', {
        receiverId2: secondId,
        senderId2: firstId,
      })
      .getOne()
      .catch((error) => {
        this.logger.error(error);
      });
  }
}
