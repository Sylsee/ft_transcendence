const API_BASE_URL: string = `http://localhost:3000`;
const SOCKET_BASE_URL: string = `http://localhost:3000/chat`;

const API_ROUTES = {
	AUTH_42: "/auth/42",
	AUTH_GOOGLE: "/auth/google",
	GENERATE_2FA: "/auth/2fa/generate",
	ENABLE_2FA: "/auth/2fa/enable",
	DISABLE_2FA: "/auth/2fa/disable",
	VERIFY_2FA: "/auth/2fa/authenticate",
	USER: (id: string) => `/users/${id}`,
	USER_STATS: (id: string) => `/users/stats/${id}`,
	USER_MATCH_HISTORY: (id: string) => `/users/match-history/${id}`,
	USER_FRIENDS: (id: string) => `/users/friends/${id}`,
	USER_FRIENDS_REQUESTS: (id: string) => `/users/friend-request/${id}`,
	USER_FRIEND_STATUS: (id: string) => `/users/friend-status/${id}`,
	USER_PROFILE_PICTURE: `/users/profile-picture`,
	CHANNELS: "/channels/available",
	CHANNEL_MESSAGES: (id: string) => `/channels/${id}/messages`,
	JOIN_CHANNEL: (id: string) => `/channels/${id}/join`,
	LEAVE_CHANNEL: (id: string) => `/channels/${id}/leave`,
	CREATE_CHANNEL: "/channels/create",
	UPDATE_CHANNEL: (id: string) => `/channels/update/${id}`,
	DELETE_CHANNEL: (id: string) => `/channels/delete/${id}`,
};

const ERROR_MESSAGES = {
	UNKNOWN_ERROR: "An unknown error occured.",
	INVALID_CHANNEL_ID: "The channel ID is invalid.",
};

enum ChatEvent {
	Message = "message",
	ChannelMessage = "channel:message",
	ChannelServerMessage = "channel:server_message",
	Notification = "notification",
	NotificationInvite = "notification:invite",
	ChannelAvailable = "channel:available",
	ChannelUnavailability = "channel:unavailable",
	Exception = "exception",
}

const JWT_NAME = "access_token";

export {
	API_BASE_URL,
	SOCKET_BASE_URL,
	API_ROUTES,
	ERROR_MESSAGES,
	ChatEvent,
	JWT_NAME,
};
