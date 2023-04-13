// Nest dependencies
import { Injectable } from '@nestjs/common';

// Local files
import { FriendRequestRepository } from './friend_request.repository';
import { UpdateFriendRequestDto } from './dto/update-friend-request.dto';
import { FriendRequest } from './entities/friend_request.entity';
import { UserEntity } from './entities/user.entity';
import { FriendRequestStatus } from './enum/friend_request-status.enum';

@Injectable()
export class FriendRequestService {
  constructor(
    private readonly friendRequestRepository: FriendRequestRepository,
  ) {}

  async changeFriendRequestStatus(
    currentUser: UserEntity,
    fromUserId: string,
    updateFriendRequestDto: UpdateFriendRequestDto,
  ): Promise<FriendRequest> {
    const request: FriendRequest = await this.friendRequestRepository.findSpecifyFriendRequest(
      currentUser.id,
      fromUserId,
    );
    if (request === undefined || request === null) {
      throw new Error(`Friend request with specify id doesn't exists`);
    }
    request.status = updateFriendRequestDto.status;
    return await this.friendRequestRepository.saveFriendRequest(request);
  }

  async deleteFriendRequestByReceiverId(senderId: string, receiverId: string): Promise<void> {
    const request = await this.friendRequestRepository.findSpecifyFriendRequest(receiverId, senderId);
    if (!request || request.status === FriendRequestStatus.approved) { //we can't delete already approved request
      return;
    }

    return this.friendRequestRepository.deleteFriendRequestByReceiverId(senderId, receiverId);
  }

  async deleteFriendRequestBetweenUsers(first: string, second: string): Promise<void> {
    const request = await this.friendRequestRepository.findPossibleFriendRequest(first, second);
    if (!request) {
      return;
    }

    await this.friendRequestRepository.deleteFriendRequest(request);
  }

  async saveFriendRequest(friendRequest: FriendRequest) {
    return this.friendRequestRepository.saveFriendRequest(friendRequest);
  }
}
