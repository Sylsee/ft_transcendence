export enum ChatEvent {
  MESSAGE = 'message',
  /*
    MessageDto
  */
  CHANNEL_SERVER_MESSAGE = 'channel:server_message',
  /*
    channelId
    message
  */
  CHANNEL_MESSAGE = 'channel:message',
  /*
    MessageDto
  */
  NOTIFICATION = 'notification',
  /*
    message
  */
  NOTIFICATION_INVITE = 'notification:invite',
  /*
      {
        sender: sender.name,
        channelId: {
          id: channel.id,
          name: channel.name,
        },
        message: `${sender.name} invited you to ${channel.name}`,
      },
  */
  CHANNEL_AVAILABLE = 'channel:available',
  /*
    channelDto
  */
  CHANNEL_UNAVAILABLE = 'channel:unavailable',
  /*
    channelId
  */
}
