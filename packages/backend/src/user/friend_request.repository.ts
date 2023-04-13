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

  async findPossibleFriendRequest(
    first: string,
    second: string,
  ): Promise<FriendRequest> {
    let friendRequest: FriendRequest;

    friendRequest = await this.friendRequestRepository
      .createQueryBuilder('req')
      .leftJoinAndSelect('req.sender', 'sender')
      .leftJoinAndSelect('req.receiver', 'receiver')
      .where('req.receiverId = :receiverId', { receiverId: first })
      .andWhere('req.senderId = :senderId', { senderId: second })
      .getOne();
    if (!friendRequest) {
      friendRequest = await this.friendRequestRepository
      .createQueryBuilder('req')
      .leftJoinAndSelect('req.sender', 'sender')
      .leftJoinAndSelect('req.receiver', 'receiver')
      .where('req.receiverId = :receiverId', { receiverId: second })
      .andWhere('req.senderId = :senderId', { senderId: first })
      .getOne();
    }

    return friendRequest;
  }

  async saveFriendRequest(
    newFriendRequest: FriendRequest,
  ): Promise<FriendRequest> {
    return await this.friendRequestRepository.save(newFriendRequest);
  }

  async deleteFriendRequestByReceiverId(senderId: string, recevierId: string) {
    await this.friendRequestRepository
      .createQueryBuilder()
      .delete()
      .where('senderId = :senderId', {senderId: senderId})
      .andWhere('receiverId = :receiverId', { recevierId: recevierId })
      .execute();
  }

  async deleteFriendRequest(friendRequest: FriendRequest): Promise<void> {
    await this.friendRequestRepository.delete(friendRequest);
  }
}
