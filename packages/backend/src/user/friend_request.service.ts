// Nest dependencies
import { Injectable } from '@nestjs/common';

// Local files
import { FriendRequestRepository } from './friend_request.repository';
import { UpdateFriendRequestDto } from './dto/update-friend-request.dto';
import { FriendRequest } from './entities/friend_request.entity';
import { UserEntity } from './entities/user.entity';

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

  async deleteFriendRequestByReceiverId(receiverId: string) {

    return this.friendRequestRepository.deleteFriendRequestByReceiverId(receiverId);
  }

  async saveFriendRequest(friendRequest: FriendRequest) {
    return this.friendRequestRepository.saveFriendRequest(friendRequest);
  }
}
