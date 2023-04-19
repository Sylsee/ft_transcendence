import { ChannelType } from "./chat";

export interface SocketState {}

export interface ChannelPayload {
	id: string;
	name: string;
	type: ChannelType;
	isJoined?: boolean;
}

export interface ChannelIdPayload {
	id: string;
}

export interface MessagePayload {
	channelId: string;
	content: string;
}
