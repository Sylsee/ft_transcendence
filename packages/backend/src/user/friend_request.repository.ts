// NestJS imports
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Third-party imports
import { Repository } from 'typeorm';

// Local files
import { FriendRequest } from './entities/friend_request.entity';

@Injectable()
export class FriendRequestRepository {
  constructor(
    @InjectRepository(FriendRequest)
    private friendRequestRepository: Repository<FriendRequest>,
  ) {}

  async findOneById(id: string): Promise<FriendRequest> {
    return this.friendRequestRepository.findOneBy({ id: id });
  }

  async findSpecifyFriendRequest(
    receiverId: string,
    senderId: string,
  ): Promise<FriendRequest> {
    return await this.friendRequestRepository
      .createQueryBuilder('req')
      .leftJoinAndSelect('req.sender', 'sender')
      .leftJoinAndSelect('req.receiver', 'receiver')
      .where('req.receiverId = :receiverId', { receiverId: receiverId })
      .andWhere('req.senderId = :senderId', { senderId: senderId })
      .getOne();
  }

  async saveFriendRequest(
    newFriendRequest: FriendRequest,
  ): Promise<FriendRequest> {
    return await this.friendRequestRepository.save(newFriendRequest);
  }

  async deleteFriendRequestByReceiverId(recevierId: string) {
    await this.friendRequestRepository
      .createQueryBuilder()
      .delete()
      .where('receiverId = :id', { id: recevierId })
      .execute();
  }
}
