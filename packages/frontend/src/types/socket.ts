import { ChannelPermissions, ChannelType } from "types/chat";

export interface SocketState {}

export interface ChannelPayload {
	id: string;
	name: string;
	type: ChannelType;
	permissions: ChannelPermissions;
}

export interface ChannelIdPayload {
	channelId: string;
}

export interface MessagePayload {
	channelId: string;
	content: string;
}
