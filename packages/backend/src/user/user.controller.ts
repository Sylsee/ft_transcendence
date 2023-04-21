// NestJs imports
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

// Local files
import { ErrorBadRequest } from 'src/error/error-bad-request';
import { UpdateFriendRequestDto } from './dto/update-friend-request.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UserService } from './services/user.service';
import { FriendRequestDto } from './dto/friend_request.dto';
import { FriendRequestService } from './services/friend_request.service';
import { UserEntity } from './entities/user.entity';
import { UserRelationshipDto } from './dto/user-relationship.dto';
import { FriendRequestStatus } from './enum/friend_request-status.enum';

const ApiUserIdParam = ApiParam({
  name: 'id',
  description: 'User ID',
  example: '12345678-abcd-1234-abcd-1234567890ab',
});

@ApiTags('Users')
@ApiExtraModels(ErrorBadRequest)
@ApiBadRequestResponse({
  description: ErrorBadRequest.description,
  schema: {
    $ref: getSchemaPath(ErrorBadRequest),
  },
})
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly friendRequestService: FriendRequestService,
  ) {}

  // TODO: Remove this endpoint
  // ------------------------------------------------------------
  // -------------------- Debug Endpoints -----------------------
  // ------------------------------------------------------------
  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieve all users.',
  })
  @ApiOkResponse({ description: 'Users found', type: [UserDto] })
  async getAllUsers() {
    return await this.userService.findAll();
  }

  // ------------------------------------------------------------
  // -------------------- User Endpoints ------------------------
  // ------------------------------------------------------------
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get user by id',
    description: 'Retrieve a user by their unique identifier.',
  })
  @ApiUserIdParam
  @ApiOkResponse({ description: 'User found', type: UserDto })
  async getUserById(@Param('id') id: string): Promise<UserDto> {
    return await this.userService.findOneDto(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Update user',
    description: 'Update the specified user with the provided data.',
  })
  @ApiUserIdParam
  @ApiOkResponse({ description: 'User updated', type: UserDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async updateUser(
    @Req() req,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    const user: UserEntity = req.user;
    return await this.userService.updateOne(user, id, updateUserDto);
  }

  // ------------------------------------------------------------
  // -------------------- Friend Endpoints ----------------------
  // ------------------------------------------------------------
  @Get('friends/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get user friends',
    description: 'Retrieve the friends of the specified user.',
  })
  @ApiUserIdParam
  @ApiOkResponse({ description: 'User friends found', type: [UserDto] })
  async getUserFriends(@Param('id') id: string) {
    return await this.userService.getFriendsById(id);
  }

  @Get('friend-status/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get user friend status',
    description:
      'Retrieve the friend status between the current user and the specified user.',
  })
  @ApiUserIdParam
  @ApiOkResponse({
    description: 'User friend status found',
    type: UserRelationshipDto,
  })
  async getUserFriendStatus(@Req() req, @Param('id') id: string) {
    const user: UserEntity = req.user;
    return await this.userService.getUserFriendsStatus(user.id, id);
  }

  @Delete('friend/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Delete a friend',
    description:
      "Remove the specified user from the current user's friends list.",
  })
  @ApiUserIdParam
  @ApiOkResponse({ description: 'Friend deleted', type: [UserDto] })
  async deleteUserFriend(@Req() req, @Param('id') id: string) {
    const user: UserEntity = req.user;
    await this.friendRequestService.deleteFriendRequestBetweenUsers(
      user.id,
      id,
    );
    await this.userService.deleteFriend(user.id, id);
  }

  // ------------------------------------------------------------
  // -------------------- Friend Request Endpoints --------------
  // ------------------------------------------------------------
  @Post('friend-request/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Send a friend request',
    description: 'Send a friend request to the specified user ID.',
  })
  @ApiUserIdParam
  @ApiOkResponse({ description: 'Friend request sent', type: [UserDto] })
  async sendUserFriendRequest(@Req() req, @Param('id') id: string) {
    const user: UserEntity = req.user;
    await this.userService.sendFriendRequest(user.id, id);
  }

  @Get('friend-request/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get user friend requests',
    description:
      'Retrieve a list of friend requests for the specified user ID.',
  })
  @ApiUserIdParam
  @ApiOkResponse({
    description: 'User friend requests found',
    type: [FriendRequestDto],
  })
  async getUserFriendRequests(@Req() req, @Param('id') id: string) {
    const user: UserEntity = req.user;
    return await this.userService.getSentFriendRequests(user.id, id);
  }

  @Patch('friend-request/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Accept or deny received friend request',
    description:
      'Accept or deny a received friend request from the specified user.',
  })
  @ApiUserIdParam
  @ApiOkResponse({ description: 'Friend request updated', type: [UserDto] })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async updateUserFriendRequest(
    @Req() req,
    @Param('id') id: string,
    @Body() updateFriendRequestDto: UpdateFriendRequestDto,
  ) {
    const user: UserEntity = req.user;

    await this.friendRequestService.changeFriendRequestStatus(
      user,
      id,
      updateFriendRequestDto,
    );

    if (updateFriendRequestDto.status === FriendRequestStatus.approved) {
      await this.userService.addNewFriend(user.id, id);
    }
  }

  @Delete('friend-request/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Delete a sent friend request',
    description: 'Cancel a friend request sent to the specified user ID.',
  })
  @ApiUserIdParam
  @ApiOkResponse({ description: 'Friend request deleted', type: [UserDto] })
  async deleteUserFriendRequest(@Req() req, @Param('id') id: string) {
    const user: UserEntity = req.user;

    await this.friendRequestService.deleteFriendRequestByReceiverId(
      user.id,
      id,
    );
  }

  // ------------------------------------------------------------
  // -------------------- Block User Endpoints ------------------
  // ------------------------------------------------------------
  @Post('block/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Block a user',
    description:
      'Block the specified user ID from interacting with the current user.',
  })
  @ApiUserIdParam
  @ApiOkResponse({ description: 'User blocked', type: [UserDto] })
  async blockUser(@Req() req, @Param('id') id: string) {
    const user: UserEntity = req.user;
    await this.userService.blockUserById(user.id, id);
  }

  @Get('block/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get blocked users',
    description: 'Retrieve a list of blocked users for the specify user.',
  })
  @ApiUserIdParam
  @ApiOkResponse({ description: 'Blocked users found', type: [UserDto] })
  async getBlockedUsers(@Req() req, @Param('id') id: string) {
    const user: UserEntity = req.user;
    return await this.userService.getBlockedUsers(req.id, id);
  }

  @Delete('block/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Unblock a user',
    description: 'Unblock the specified user by their unique identifier.',
  })
  @ApiUserIdParam
  @ApiOkResponse({ description: 'User unblocked', type: [UserDto] })
  async unblockUser(@Req() req, @Param('id') id: string) {
    const user: UserEntity = req.user;
    await this.userService.unblockUserById(user.id, id);
  }
}
