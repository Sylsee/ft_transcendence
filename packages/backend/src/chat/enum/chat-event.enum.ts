export enum ChatEvent {
  ChannelServerMessage = 'channel:server_message',
  /*
    channelId: string
    content: string
  */
  ChannelMessage = 'channel:message',
  /*
    MessageDto
  */
  Notification = 'notification',
  /*
    content: string
  */
  NotificationInvite = 'notification:invite',
  /*
      channelId:  string,
      content: `${sender.name} invited you to ${channel.name}`,
  */
  ChannelAvailable = 'channel:available',
  /*
    ChannelDto
  */
  ChannelUnavailable = 'channel:unavailable',
  /*
    channelId: string
  */
  UserStatus = 'user.status',
  /*
    id: string
    status: UserStatus
  */
}
