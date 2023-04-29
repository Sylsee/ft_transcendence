/* eslint-disable @typescript-eslint/no-unused-vars */
// NestJS imports
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

// Third-party imports
import { Request } from 'express';

// Local imports
import { Jwt2faAuthGuard } from 'src/auth/guard/jwt-2fa-auth.guard';
import { multerConfig } from 'src/config/multer.config';
import { getProfilePictureUrl } from 'src/shared/profile-picture';
import { FriendRequestsDto } from './dto/relationship/friend-requests.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './entities/user.entity';
import { FriendRequestService } from './services/friend_request.service';
import { UserService } from './services/user.service';

const ApiUserIdParam = ApiParam({
  name: 'id',
  description: 'User ID',
  example: '12345678-abcd-1234-abcd-1234567890ab',
});

@ApiTags('Users')
@Controller('users')
export class UserController {
  private readonly logger: Logger = new Logger(UserController.name);

  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private readonly friendRequestService: FriendRequestService,
  ) {}

  // TODO: Remove this endpoint
  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieve all users.',
  })
  @ApiOkResponse({ description: 'Users found', type: [UserDto] })
  async getAllUsers(@Req() request: Request): Promise<any> {
    if (this.configService.get<string>('NODE_ENV') === 'production') {
      throw new BadRequestException();
    }
    return {
      token: request.cookies['access_token'],
      ...(await this.userService.findAll()),
    };
  }

  // ------------------------------------------------------------
  // -------------------- User Endpoints ------------------------
  // ------------------------------------------------------------

  @Get('user/:id')
  @UseGuards(Jwt2faAuthGuard)
  @ApiOperation({
    summary: 'Get user by id',
    description: 'Retrieve a user by their unique identifier.',
  })
  @ApiUserIdParam
  @ApiOkResponse({ description: 'User found', type: UserDto })
  @ApiBadRequestResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getUserById(@Req() req, @Param('id') id: string): Promise<UserDto> {
    const user = await this.userService.findOneWithRelations(id, ['friends']);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const userDto = UserDto.transform(user, req.user);
    return userDto;
  }

  @Patch()
  @UseGuards(Jwt2faAuthGuard)
  @ApiOperation({
    summary: 'Update user name',
    description: 'Update the name of the current user.',
  })
  @ApiUserIdParam
  @ApiOkResponse({ description: 'User name updated', type: UserDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async updateUserName(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    return await this.userService.updateName(req.user, updateUserDto);
  }

  @Post('profile-picture')
  @UseGuards(Jwt2faAuthGuard)
  @UseInterceptors(FileInterceptor('profile-picture', multerConfig))
  @ApiOperation({
    summary: 'Upload profile picture',
    description: 'Upload a profile picture for the current user.',
  })
  @ApiOkResponse({ description: 'Profile picture uploaded' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async uploadProfilePicture(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const profilePictureUrl = getProfilePictureUrl(file.filename);

    if (req.user.profilePictureUrl !== profilePictureUrl) {
      req.user.profilePictureUrl = profilePictureUrl;
      this.userService.save(req.user);
    }
  }

  // ------------------------------------------------------------
  // -------------------- Friend Endpoints ----------------------
  // ------------------------------------------------------------

  @Get('friends/:id')
  @UseGuards(Jwt2faAuthGuard)
  @ApiOperation({
    summary: 'Get user friends',
    description: 'Retrieve the friends of the specified user.',
  })
  @ApiUserIdParam
  @ApiOkResponse({ description: 'User friends found', type: [UserDto] })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getFriends(@Param('id') id: string) {
    return await this.userService.getFriendsById(id);
  }

  @Get('friend-status/:id')
  @UseGuards(Jwt2faAuthGuard)
  @ApiOperation({
    summary: 'Get user friend status',
    description:
      'Retrieve the friend status between the current user and the specified user.',
  })
  @ApiUserIdParam
  @ApiOkResponse({
    description: 'User friend status found',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getFriendStatus(@Req() req, @Param('id') id: string) {
    return await this.userService.getFriendStatus(req.user.id, id);
  }

  @Delete('friend/:id')
  @UseGuards(Jwt2faAuthGuard)
  @ApiOperation({
    summary: 'Delete a friend',
    description:
      "Remove the specified user from the current user's friends list.",
  })
  @ApiUserIdParam
  @ApiOkResponse({ description: 'Friend deleted', type: [UserDto] })
  @ApiNotFoundResponse({ description: 'Friend request not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async deleteUserFriend(@Req() req, @Param('id') id: string) {
    const user: UserEntity = req.user;
    await this.userService.deleteFriend(user.id, id);
  }

  // ------------------------------------------------------------
  // -------------------- Friend Request Endpoints --------------
  // ------------------------------------------------------------

  @Post('friend-request/:id')
  @UseGuards(Jwt2faAuthGuard)
  @ApiOperation({
    summary: 'Send a friend request',
    description: 'Send a friend request to the specified user ID.',
  })
  @ApiUserIdParam
  @ApiOkResponse({ description: 'Friend request sent', type: [UserDto] })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({
    description: 'Cannot send friend request to yourself',
  })
  @ApiConflictResponse({ description: 'Friend request already sent' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async sendUserFriendRequest(@Req() req, @Param('id') id: string) {
    await this.userService.sendFriendRequest(req.user.id, id);
  }

  @Get('friend-request')
  @UseGuards(Jwt2faAuthGuard)
  @ApiOperation({
    summary: 'Get user friend requests',
    description: 'Retrieve the list of friend requests.',
  })
  @ApiUserIdParam
  @ApiOkResponse({
    description: 'User friend requests found',
    type: FriendRequestsDto,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getFriendRequests(@Req() req): Promise<FriendRequestsDto> {
    return await this.userService.getFriendRequests(req.user.id);
  }

  @Patch('friend-request/:id/approve')
  @UseGuards(Jwt2faAuthGuard)
  @ApiOperation({
    summary: 'Accept received friend request',
    description: 'Accept a received friend request from the specified user.',
  })
  @ApiUserIdParam
  @ApiOkResponse({ description: 'Friend request accepted' })
  @ApiNotFoundResponse({ description: 'Friend request not found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async approveFriendRequest(@Req() req, @Param('id') id: string) {
    await this.friendRequestService.deleteFriendRequest(id, req.user.id);
    await this.userService.addNewFriend(req.user.id, id);
  }

  @Patch('friend-request/:id/reject')
  @UseGuards(Jwt2faAuthGuard)
  @ApiOperation({
    summary: 'Deny received friend request',
    description: 'Deny a received friend request from the specified user.',
  })
  @ApiUserIdParam
  @ApiOkResponse({ description: 'Friend request denied' })
  @ApiNotFoundResponse({ description: 'Friend request not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async rejectFriendRequest(@Req() req, @Param('id') id: string) {
    await this.friendRequestService.deleteFriendRequest(id, req.user.id);
  }

  @Delete('friend-request/:id')
  @UseGuards(Jwt2faAuthGuard)
  @ApiOperation({
    summary: 'Delete a sent friend request',
    description: 'Cancel a friend request sent to the specified user ID.',
  })
  @ApiUserIdParam
  @ApiOkResponse({ description: 'Friend request deleted' })
  @ApiNotFoundResponse({ description: 'Friend request not found' })
  @ApiBadRequestResponse({ description: 'Friend request already processed' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async deleteUserFriendRequest(@Req() req, @Param('id') id: string) {
    await this.friendRequestService.deleteFriendRequest(req.user.id, id);
  }

  // ------------------------------------------------------------
  // -------------------- Block User Endpoints ------------------
  // ------------------------------------------------------------

  @Post('block/:id')
  @UseGuards(Jwt2faAuthGuard)
  @ApiOperation({
    summary: 'Block a user',
    description:
      'Block the specified user ID from interacting with the current user.',
  })
  @ApiUserIdParam
  @ApiOkResponse({ description: 'User blocked', type: [UserDto] })
  @ApiBadRequestResponse({ description: 'Cannot block yourself' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async blockUser(@Req() req, @Param('id') id: string) {
    await this.userService.blockUserById(req.user.id, id);
  }

  @Get('block')
  @UseGuards(Jwt2faAuthGuard)
  @ApiOperation({
    summary: 'Get blocked users',
    description: 'Retrieve the list of blocked users.',
  })
  @ApiUserIdParam
  @ApiOkResponse({ description: 'Blocked users found', type: [UserDto] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getBlockedUsers(@Req() req) {
    return await this.userService.getBlockedUsers(req.user.id);
  }

  @Delete('block/:id')
  @UseGuards(Jwt2faAuthGuard)
  @ApiOperation({
    summary: 'Unblock a user',
    description: 'Unblock the specified user by their unique identifier.',
  })
  @ApiUserIdParam
  @ApiOkResponse({ description: 'User unblocked', type: [UserDto] })
  @ApiBadRequestResponse({ description: 'User is not blocked' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async unblockUser(@Req() req, @Param('id') id: string) {
    await this.userService.unblockUserById(req.user.id, id);
  }
}
