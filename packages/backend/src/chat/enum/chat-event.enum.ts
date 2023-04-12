export enum ChatEvent {
  MESSAGE = 'message',
  /*
    MessageDto
  */
  CHANNEL_MESSAGE = 'channel:message',
  /*
    channelID
    message
  */
  NOTIFICATION = 'notification',
  /*
    message
  */
  NOTIFICATION_INVITE = 'notification:invite',
  /*
      {
        sender: sender.name,
        channelID: {
          id: channel.id,
          name: channel.name,
        },
        message: `${sender.name} invited you to ${channel.name}`,
      },
  */
  CHANNEL_VISIBLE = 'channel:visible',
  /*
    channelDto
  */
  CHANNEL_INVISIBLE = 'channel:invisible',
  /*
    channelID
  */
}
