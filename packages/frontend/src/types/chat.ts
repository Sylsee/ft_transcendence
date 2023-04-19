export enum ChannelType {
	public = "public",
	private = "private",
	password_protected = "password-protected",
	direct_message = "direct-message",
}

export interface ChannelPermissions {
	canDelete: boolean;
	canModify: boolean;
	isMember: boolean;
}

export interface Channel {
	id: string;
	name: string;
	permissions: ChannelPermissions;
	type: ChannelType;
	hasBeenFetched: boolean;
	messages: Message[];
}

export interface ChatState {
	channels: Channel[];
	activeChannelId: string | null;
}

export interface MessageSender {
	id: string;
	name: string;
	avatarUrl: string;
}

export interface Message {
	id: string;
	channelId: string;
	content: string;
	sender: MessageSender;
	timestamp: Date;
}

// API

export interface JoinChannelRequest {
	password?: string;
}
