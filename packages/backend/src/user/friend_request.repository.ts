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

  findOneById(id: string): Promise<FriendRequest> {
    return this.friendRequestRepository.findOneBy({ id: id });
  }

  findSpecifyFriendRequest(
    receiverId: string,
    senderId: string,
  ): Promise<FriendRequest> {
    return this.friendRequestRepository
      .createQueryBuilder('req')
      .leftJoinAndSelect('req.sender', 'sender')
      .leftJoinAndSelect('req.receiver', 'receiver')
      .where('req.receiverId = :receiverId', { receiverId: receiverId })
      .andWhere('req.senderId = :senderId', { senderId: senderId })
      .getOne();
  }

  findPossibleFriendRequest(
    firstId: string,
    secondId: string,
  ): Promise<FriendRequest> {
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
    .getOne();
  }

  saveFriendRequest(
    newFriendRequest: FriendRequest,
  ): Promise<FriendRequest> {
    return this.friendRequestRepository.save(newFriendRequest);
  }

  async deleteFriendRequestByReceiverId(senderId: string, recevierId: string) {
    this.deleteFriendRequest(await this.findSpecifyFriendRequest(recevierId, senderId));
  }

  deleteFriendRequest(friendRequest: FriendRequest) {
    this.friendRequestRepository.delete(friendRequest);
  }
}
