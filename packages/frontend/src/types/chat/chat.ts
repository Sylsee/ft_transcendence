import { User } from "types/user/user";

export enum ChannelType {
	Public = "public",
	Private = "private",
	Password_protected = "password-protected",
	Direct_message = "direct-message",
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
	messages: ChatMessage[];
	user?: User;
}

export interface ChatState {
	channels: Channel[];
	activeChannelId: string | null;
	selectedChannelId: string | null;
	showModal: boolean;
	showChat: boolean;
}

export interface MessageSender {
	id: string;
	name: string;
	profilePictureUrl: string;
}

export enum MessageType {
	Normal,
	Special,
}

export interface Message {
	type: MessageType.Normal;
	id: string;
	channelId: string;
	content: string;
	sender: MessageSender;
	timestamp: Date;
}

export interface ServerMessage {
	type: MessageType.Special;
	channelId: string;
	content: string;
}

export type ChatMessage = Message | ServerMessage;

export enum ChatModalType {
	Join,
	Create,
	Update,
}

// API

export interface CreateChannelRequest {
	name?: string;
	type: ChannelType;
	password?: string;
	otherUserId?: string;
}

export interface JoinChannelData {
	password?: string;
}

export interface JoinChannelRequest {
	id: string;
	data: JoinChannelData;
}

export enum ChannelModalType {
	None,
	Create,
	Join,
	Update,
}

export interface SetMessagesPayload {
	channelId: string;
	messages: Message[];
}
