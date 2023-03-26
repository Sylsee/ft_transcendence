// NestJs imports
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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
import { User, UserRelationshipDto } from './model/user.model';
import { UserService } from './user.service';

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
  constructor(private readonly userService: UserService) {}

  // TODO: Remove this endpoint
  // ------------------------------------------------------------
  // -------------------- Debug Endpoints -----------------------
  // ------------------------------------------------------------
  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieve all users.',
  })
  @ApiOkResponse({ description: 'Users found', type: [User] })
  async getAllUsers() {
    return this.userService.findAll();
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
  @ApiOkResponse({ description: 'User found', type: User })
  async getUserById(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Update user',
    description: 'Update the specified user with the provided data.',
  })
  @ApiUserIdParam
  @ApiOkResponse({ description: 'User updated', type: User })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    // Implement the method to update user
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
  @ApiOkResponse({ description: 'User friends found', type: [User] })
  async getUserFriends(@Param('id') id: string) {
    // Implement the method to fetch user friends
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
  async getUserFriendStatus(@Param('id') id: string) {
    // Implement the method to fetch user friend status
  }

  @Delete('friend/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Delete a friend',
    description:
      "Remove the specified user from the current user's friends list.",
  })
  @ApiUserIdParam
  @ApiOkResponse({ description: 'Friend deleted', type: [User] })
  async deleteUserFriend(@Param('id') id: string) {
    // Implement the method to delete a friend
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
  @ApiOkResponse({ description: 'Friend request sent', type: [User] })
  async sendUserFriendRequest(@Param('id') id: string) {
    // Implement the method to send a friend request
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
    type: [User],
  })
  async getUserFriendRequests(@Param('id') id: string) {
    // Implement the method to fetch user friend requests
  }

  @Patch('friend-request/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Accept or deny received friend request',
    description:
      'Accept or deny a received friend request from the specified user.',
  })
  @ApiUserIdParam
  @ApiOkResponse({ description: 'Friend request updated', type: [User] })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async updateUserFriendRequest(
    @Param('id') id: string,
    @Body() updateFriendRequestDto: UpdateFriendRequestDto,
  ) {
    // Implement the method to accept or deny received friend request
  }

  @Delete('friend-request/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Delete a sent friend request',
    description: 'Cancel a friend request sent to the specified user ID.',
  })
  @ApiUserIdParam
  @ApiOkResponse({ description: 'Friend request deleted', type: [User] })
  async deleteUserFriendRequest(@Param('id') id: string) {
    // Implement the method to delete a sent friend request
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
  @ApiOkResponse({ description: 'User blocked', type: [User] })
  async blockUser(@Param('id') id: string) {
    // Implement the method to block a user
  }

  @Get('block/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get blocked users',
    description: 'Retrieve a list of blocked users for the current user.',
  })
  @ApiUserIdParam
  @ApiOkResponse({ description: 'Blocked users found', type: [User] })
  async getBlockedUsers(@Param('id') id: string) {
    // Implement the method to fetch blocked users
  }

  @Delete('block/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Unblock a user',
    description: 'Unblock the specified user by their unique identifier.',
  })
  @ApiUserIdParam
  @ApiOkResponse({ description: 'User unblocked', type: [User] })
  async unblockUser(@Param('id') id: string) {
    // Implement the method to unblock a user
  }
}
