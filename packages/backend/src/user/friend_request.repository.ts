// NestJS imports
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Third-party imports
import { Repository } from 'typeorm';

// Local files
import { FriendRequest } from './entities/friend_request.entity';
import { FriendRequestStatus } from './enum/friend_request-status.enum';
import { UpdateFriendRequestDto } from './dto/update-friend-request.dto';

@Injectable()
export class FriendRequestRepository {
  constructor(
    @InjectRepository(FriendRequest)
    private friendRequestRepository: Repository<FriendRequest>
  ) {}

  async saveFriendRequest(newFriendRequest: FriendRequest): Promise<void> {
    this.friendRequestRepository.save(newFriendRequest);
  }

  async changeFriendRequestStatus(id: string, updateFriendRequestDto: UpdateFriendRequestDto): Promise<void> {
    const request = await this.friendRequestRepository.findOneBy({id: id});
    request.status = updateFriendRequestDto.status;
    this.friendRequestRepository.save(request);
  }

  async deleteFriendRequestById(id: string) {
    await this.friendRequestRepository
    .createQueryBuilder()
    .delete()
    .where('id = :id', { id })
    .execute(); 
  }
}
