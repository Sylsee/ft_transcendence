export enum ChatEvent {
  MESSAGE = 'message',
  /*
    MessageDto
  */
  CHANNEL_SERVER_MESSAGE = 'channel:server_message',
  /*
    channelId: string
    content: string
  */
  CHANNEL_MESSAGE = 'channel:message',
  /*
    MessageDto
  */
  NOTIFICATION = 'notification',
  /*
    content: string
  */
  NOTIFICATION_INVITE = 'notification:invite',
  /*
      channelId:  string,
      content: `${sender.name} invited you to ${channel.name}`,
  */
  CHANNEL_AVAILABLE = 'channel:available',
  /*
    ChannelDto
  */
  CHANNEL_UNAVAILABLE = 'channel:unavailable',
  /*
    channelId: string
  */
}
