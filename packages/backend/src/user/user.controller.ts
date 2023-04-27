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
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

// Third-party imports
import { Request } from 'express';

// Local imports
import { Jwt2faAuthGuard } from 'src/auth/guard/jwt-2fa-auth.guard';
import { multerConfig } from 'src/config/multer.config';
import { UpdateFriendRequestDto } from './dto/update-friend-request.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

const ApiUserIdParam = ApiParam({
  name: 'id',
  description: 'User ID',
  example: '12345678-abcd-1234-abcd-1234567890ab',
});

@ApiTags('Users')
@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private userService: UserService,
    private configService: ConfigService,
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
  @Get(':id')
  @UseGuards(Jwt2faAuthGuard)
  @ApiOperation({
    summary: 'Get user by id',
    description: 'Retrieve a user by their unique identifier.',
  })
  @ApiUserIdParam
  @ApiOkResponse({ description: 'User found', type: UserDto })
  async getUserById(@Param('id') id: string) {
    return await this.userService.findOneById(id);
  }

  @Patch(':id')
  @UseGuards(Jwt2faAuthGuard)
  @ApiOperation({
    summary: 'Update user',
    description: 'Update the specified user with the provided data.',
  })
  @ApiUserIdParam
  @ApiOkResponse({ description: 'User updated', type: UserDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    // Implement the method to update user
  }

  @Post('profile-picture')
  @UseGuards(Jwt2faAuthGuard)
  @UseInterceptors(FileInterceptor('profile-picture', multerConfig))
  @ApiOperation({
    summary: 'Upload profile picture',
    description: 'Upload a profile picture for the current user.',
  })
  @ApiOkResponse({ description: 'Profile picture uploaded', type: UserDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async uploadProfilePicture(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const user: UserEntity = req.user;
    const profilePictureUrl = this.userService.getProfilePictureUrl(
      file.filename,
    );
    if (user.profilePictureUrl !== profilePictureUrl) {
      user.profilePictureUrl = profilePictureUrl;
      this.userService.save(user);
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
  async getUserFriends(@Param('id') id: string) {
    // Implement the method to fetch user friends
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
  async getUserFriendStatus(@Param('id') id: string) {
    // Implement the method to fetch user friend status
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
  async deleteUserFriend(@Param('id') id: string) {
    // Implement the method to delete a friend
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
  async sendUserFriendRequest(@Param('id') id: string) {
    // Implement the method to send a friend request
  }

  @Get('friend-request/:id')
  @UseGuards(Jwt2faAuthGuard)
  @ApiOperation({
    summary: 'Get user friend requests',
    description:
      'Retrieve a list of friend requests for the specified user ID.',
  })
  @ApiUserIdParam
  @ApiOkResponse({
    description: 'User friend requests found',
    type: [UserDto],
  })
  async getUserFriendRequests(@Param('id') id: string) {
    // Implement the method to fetch user friend requests
  }

  @Patch('friend-request/:id')
  @UseGuards(Jwt2faAuthGuard)
  @ApiOperation({
    summary: 'Accept or deny received friend request',
    description:
      'Accept or deny a received friend request from the specified user.',
  })
  @ApiUserIdParam
  @ApiOkResponse({ description: 'Friend request updated', type: [UserDto] })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async updateUserFriendRequest(
    @Param('id') id: string,
    @Body() updateFriendRequestDto: UpdateFriendRequestDto,
  ) {
    // Implement the method to accept or deny received friend request
  }

  @Delete('friend-request/:id')
  @UseGuards(Jwt2faAuthGuard)
  @ApiOperation({
    summary: 'Delete a sent friend request',
    description: 'Cancel a friend request sent to the specified user ID.',
  })
  @ApiUserIdParam
  @ApiOkResponse({ description: 'Friend request deleted', type: [UserDto] })
  async deleteUserFriendRequest(@Param('id') id: string) {
    // Implement the method to delete a sent friend request
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
  async blockUser(@Param('id') id: string) {
    // Implement the method to block a user
  }

  @Get('block/:id')
  @UseGuards(Jwt2faAuthGuard)
  @ApiOperation({
    summary: 'Get blocked users',
    description: 'Retrieve a list of blocked users for the current user.',
  })
  @ApiUserIdParam
  @ApiOkResponse({ description: 'Blocked users found', type: [UserDto] })
  async getBlockedUsers(@Param('id') id: string) {
    // Implement the method to fetch blocked users
  }

  @Delete('block/:id')
  @UseGuards(Jwt2faAuthGuard)
  @ApiOperation({
    summary: 'Unblock a user',
    description: 'Unblock the specified user by their unique identifier.',
  })
  @ApiUserIdParam
  @ApiOkResponse({ description: 'User unblocked', type: [UserDto] })
  async unblockUser(@Param('id') id: string) {
    // Implement the method to unblock a user
  }
}
