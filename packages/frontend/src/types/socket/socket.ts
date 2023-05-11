import { ChannelPermissions, ChannelType } from "types/chat/chat";

// channel
export interface ChannelPayload {
	id: string;
	name: string;
	type: ChannelType;
	permissions: ChannelPermissions;
}

export interface ChannelIdPayload {
	channelId: string;
}
