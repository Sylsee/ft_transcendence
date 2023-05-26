// NestJS imports
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

// Local imports
import { Jwt2faAuthGuard } from 'src/auth/guard/jwt-2fa-auth.guard';
import { ChannelDto } from './dto/channel/channel.dto';
import { CreateChannelDto } from './dto/channel/create-channel.dto';
import { JoinChannelDto } from './dto/channel/join-channel.dto';
import { UpdateChannelDto } from './dto/channel/update-channel.dto';
import { MessageDto } from './dto/message/message.dto';
import { ChannelEntity } from './entities/channel.entity';
import { ChannelService } from './services/channel.service';

@ApiTags('Channel')
@Controller('channels')
export class ChannelController {
  constructor(
    private channelService: ChannelService,
    private readonly configService: ConfigService,
  ) {}

  // ----------------------- Debug Endpoints -----------------------

  @Get('debug')
  @ApiOperation({
    summary: 'Get all channels',
    description: 'Retrieve all channels.',
  })
  @ApiOkResponse({ description: 'Channels found' })
  async getAllChannels(): Promise<ChannelEntity[] | void> {
    if (this.configService.get<string>('NODE_ENV') === 'production') {
      throw new BadRequestException();
    }
    return await this.channelService.findAllChannels();
  }

  // -------------------- Channel Management Endpoints -----------------------

  @Post('create')
  @UseGuards(Jwt2faAuthGuard)
  @ApiOperation({
    summary: 'Create a channel',
    description: 'Create a new channel with the specified name.',
  })
  @ApiCreatedResponse({ description: 'Channel created', type: [ChannelDto] })
  @ApiForbiddenResponse({
    description: 'Users already have a direct message channel',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @HttpCode(HttpStatus.CREATED)
  async createChannel(
    @Req() req: any,
    @Body() body: CreateChannelDto,
  ): Promise<ChannelDto> {
    return await this.channelService.create(body, req.user);
  }

  @Patch('update/:id')
  @UseGuards(Jwt2faAuthGuard)
  @ApiOperation({
    summary: 'Update a channel',
    description: 'Update a channel with the specified id.',
  })
  @ApiOkResponse({ description: 'Channel updated', type: [ChannelDto] })
  @ApiNotFoundResponse({ description: 'Channel not found' })
  @ApiForbiddenResponse({ description: 'User not authorized' })
  @HttpCode(HttpStatus.OK)
  async updateChannel(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateChannelDto,
  ): Promise<ChannelDto> {
    return await this.channelService.update(req.user.id, id, body);
  }

  @Delete('delete/:id')
  @UseGuards(Jwt2faAuthGuard)
  @ApiOperation({
    summary: 'Delete a channel',
    description: 'Delete a channel with the specified id.',
  })
  @ApiNoContentResponse({ description: 'Channel deleted' })
  @ApiNotFoundResponse({ description: 'Channel not found' })
  @ApiForbiddenResponse({ description: 'User not authorized' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteChannel(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) channelId: string,
  ): Promise<void> {
    return await this.channelService.delete(req.user.id, channelId);
  }

  // -------------------- Channel Access Endpoints -----------------------

  @Post(':id/join')
  @UseGuards(Jwt2faAuthGuard)
  @ApiOperation({
    summary: 'Join a channel',
    description: 'Join a channel with the specified id.',
  })
  @ApiOkResponse({ description: 'Channel joined', type: [ChannelDto] })
  @ApiNotFoundResponse({ description: 'Channel not found' })
  @ApiForbiddenResponse({ description: 'User not authorized' })
  @ApiBadRequestResponse({ description: 'Incorrect password' })
  @HttpCode(HttpStatus.OK)
  async joinChannel(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) channelId: string,
    @Body() body: JoinChannelDto,
  ): Promise<ChannelDto> {
    return await this.channelService.joinChannel(
      req.user,
      channelId,
      body.password,
    );
  }

  @Post(':id/leave')
  @UseGuards(Jwt2faAuthGuard)
  @ApiOperation({
    summary: 'Leave a channel',
    description: 'Leave a channel with the specified id.',
  })
  @ApiNoContentResponse({ description: 'Channel left' })
  @ApiNotFoundResponse({ description: 'Channel not found' })
  @ApiForbiddenResponse({ description: 'User not authorized' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async leaveChannel(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) channelId: string,
  ): Promise<void> {
    return await this.channelService.leaveChannel(req.user, channelId);
  }

  // -------------------- Channel Retrieval Endpoints -----------------------

  @Get('available')
  @UseGuards(Jwt2faAuthGuard)
  @ApiOperation({
    summary: 'Get available channels',
    description: 'Retrieve all channels that are available to the user.',
  })
  @ApiOkResponse({ description: 'Channels found', type: [ChannelDto] })
  @HttpCode(HttpStatus.OK)
  async getAvailableChannels(@Req() req: any): Promise<ChannelDto[]> {
    return await this.channelService.findAvailableChannels(req.user.id);
  }

  @Get(':id/messages')
  @UseGuards(Jwt2faAuthGuard)
  @ApiOperation({
    summary: 'Get messages in a channel',
    description: 'Retrieve all messages in a channel.',
  })
  @ApiOkResponse({ description: 'Messages found', type: [MessageDto] })
  @ApiNotFoundResponse({ description: 'Channel not found' })
  @ApiForbiddenResponse({ description: 'User not authorized' })
  @HttpCode(HttpStatus.OK)
  async getMessagesInChannel(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) channelId: string,
  ): Promise<MessageDto[]> {
    return await this.channelService.findMessagesInChannel(
      req.user.id,
      channelId,
    );
  }
}
