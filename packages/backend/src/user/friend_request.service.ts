// Nest dependencies
import { Injectable } from '@nestjs/common';

// Local files
import { FriendRequestRepository } from './friend_request.repository';
import { UpdateFriendRequestDto } from './dto/update-friend-request.dto';
import { FriendRequest } from './entities/friend_request.entity';

@Injectable()
export class FriendRequestService {
  constructor(private readonly friendRequestRepository: FriendRequestRepository) {}

  async changeFriendRequestStatus(id: string, updateFriendRequestDto: UpdateFriendRequestDto): Promise<void> {
    return this.friendRequestRepository.changeFriendRequestStatus(id, updateFriendRequestDto);
  }

  async deleteFriendRequestById(id: string) {
    return this.friendRequestRepository.deleteFriendRequestById(id);
  }

  async saveFriendRequest(friendRequest: FriendRequest) {
    return this.friendRequestRepository.saveFriendRequest(friendRequest);
  }
}
