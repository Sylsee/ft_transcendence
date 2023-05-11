// NestJS imports
import { Injectable, Logger, NotFoundException } from '@nestjs/common';

// Local imports
import { FriendRequest } from '../entities/friend_request.entity';
import { UserEntity } from '../entities/user.entity';
import { FriendRequestRepository } from '../repositories/friend_request.repository';

@Injectable()
export class FriendRequestService {
  private readonly logger: Logger = new Logger(FriendRequestService.name);

  constructor(
    private readonly friendRequestRepository: FriendRequestRepository,
  ) {}

  async create(
    sender: UserEntity,
    receiver: UserEntity,
  ): Promise<FriendRequest> {
    return this.friendRequestRepository.create(sender, receiver);
  }

  async deleteFriendRequest(
    senderId: string,
    receiverId: string,
  ): Promise<void> {
    const result = await this.friendRequestRepository.delete(
      senderId,
      receiverId,
    );
    if (result.affected === 0) {
      throw new NotFoundException('Friend request not found');
    }
  }
}
