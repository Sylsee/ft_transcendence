// Nest dependencies
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

// Local files
import { FriendRequestRepository } from '../repositories/friend_request.repository';
import { UpdateFriendRequestDto } from '../dto/update-friend-request.dto';
import { FriendRequest } from '../entities/friend_request.entity';
import { UserEntity } from '../entities/user.entity';
import { FriendRequestStatus } from '../enum/friend_request-status.enum';

@Injectable()
export class FriendRequestService {
  constructor(
    private readonly friendRequestRepository: FriendRequestRepository,
  ) {}

  async changeFriendRequestStatus(
    currentUser: UserEntity,
    fromUserId: string,
    updateFriendRequestDto: UpdateFriendRequestDto,
  ): Promise<void> {
    const request = await this.friendRequestRepository.findSpecifyFriendRequest(
      currentUser.id,
      fromUserId,
    );

    if (!request) {
      throw new NotFoundException(
        `Friend request with specify id doesn't exists`,
      );
    } else if (request.status === updateFriendRequestDto.status) {
      throw new BadRequestException(
        `Request already have status ${updateFriendRequestDto.status}`,
      );
    }

    request.status = updateFriendRequestDto.status;
    await this.friendRequestRepository.saveFriendRequest(request);
  }

  async deleteFriendRequestByReceiverId(
    senderId: string,
    receiverId: string,
  ): Promise<void> {
    const request = await this.friendRequestRepository.findSpecifyFriendRequest(
      receiverId,
      senderId,
    );
    if (!request) {
      throw new NotFoundException('Friend request not found');
    } else if (request.status === FriendRequestStatus.approved) {
      throw new BadRequestException("You can't delete approved friend request");
    }

    this.friendRequestRepository.deleteFriendRequest(request);
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
      return;
    }

    this.friendRequestRepository.deleteFriendRequest(request);
  }

  async saveFriendRequest(friendRequest: FriendRequest) {
    return await this.friendRequestRepository.saveFriendRequest(friendRequest);
  }
}
