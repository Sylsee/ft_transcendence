import { apiClient } from "api/api";
import { API_ROUTES } from "config";
import { Channel, CreateChannelRequest, JoinChannelData } from "types/chat";

const fetchChannels = async () => {
	const response = await apiClient.get(API_ROUTES.CHANNELS);
	return response.data;
};

const fetchChannelMessages = async (channelId: string) => {
	const response = await apiClient.get(
		API_ROUTES.CHANNEL_MESSAGES(channelId)
	);
	return response.data;
};

const joinChannel = async (channelId: string, data: JoinChannelData) => {
	const response = await apiClient.post(
		API_ROUTES.JOIN_CHANNEL(channelId),
		data
	);
	return response.data;
};

const createChannel = async (channel: CreateChannelRequest) => {
	const response = await apiClient.post(API_ROUTES.CREATE_CHANNEL, channel);
	return response.data;
};

const updateChannel = async (
	channelId: string,
	channel: Partial<CreateChannelRequest>
) => {
	const response = await apiClient.patch(
		API_ROUTES.UPDATE_CHANNEL(channelId),
		channel
	);
	return response.data;
};

const leaveChannel = async (channelId: string): Promise<Channel> => {
	const response = await apiClient.post(API_ROUTES.LEAVE_CHANNEL(channelId));
	return response.data;
};

const deleteChannel = async (channelId: string) => {
	const response = await apiClient.delete(
		API_ROUTES.DELETE_CHANNEL(channelId)
	);
	return response.data;
};

export {
	fetchChannels,
	fetchChannelMessages,
	joinChannel,
	createChannel,
	updateChannel,
	leaveChannel,
	deleteChannel,
};
