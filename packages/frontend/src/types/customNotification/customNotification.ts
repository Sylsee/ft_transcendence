// customNotification types
export enum CustomNotificationType {
	ChannelInvitation,
	LobbyInvitation,
}

export interface ChannelNotification {
	type: CustomNotificationType;
	channelId: string;
	content: string;
}

export type LobbyNotification = Omit<ChannelNotification, "channelId"> & {
	lobbyId: string;
};

export type CustomNotification = ChannelNotification | LobbyNotification;

// customNotification slice
export interface CustomNotificationState {
	notifications: CustomNotification[];
}
