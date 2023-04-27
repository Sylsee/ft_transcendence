export enum CustomNotificationType {
	ChannelInvitation,
}

export interface ChannelNotifications {
	type: CustomNotificationType;
	channelId: string;
	content: string;
}

export type CustomNotification = ChannelNotifications;

export interface CustomNotificationState {
	notifications: CustomNotification[];
}
