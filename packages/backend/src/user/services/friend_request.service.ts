// NestJS imports
import { Injectable, NotFoundException } from '@nestjs/common';

// Local imports
import { FriendRequestRepository } from '../repositories/friend_request.repository';

@Injectable()
export class FriendRequestService {
  constructor(
    private readonly friendRequestRepository: FriendRequestRepository,
  ) {}

  async deleteFriendRequest(
    senderId: string,
    receiverId: string,
  ): Promise<void> {
    const request = await this.friendRequestRepository.findFriendRequest(
      senderId,
      receiverId,
    );
    if (!request) {
      throw new NotFoundException('Friend request not found');
    }

    this.friendRequestRepository.delete(request);
  }

  async deleteFriendRequestBetweenUsers(
    first: string,
    second: string,
  ): Promise<void> {
    const request =
      await this.friendRequestRepository.findPossibleFriendRequest(
        first,
        second,
      );
    if (!request) {
      throw new NotFoundException('Friend request not found');
    }

    this.friendRequestRepository.delete(request);
  }
}
