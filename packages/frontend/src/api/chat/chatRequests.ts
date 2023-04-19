import { API_ROUTES } from "../../config";
import { JoinChannelRequest } from "../../types/chat";
import { apiClient } from "../api";

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

const joinChannel = async (channelId: string, data: JoinChannelRequest) => {
	console.log(data);

	const response = await apiClient.post(
		API_ROUTES.JOIN_CHANNEL(channelId),
		data
	);
	return response.data;
};

export { fetchChannels, fetchChannelMessages, joinChannel };
