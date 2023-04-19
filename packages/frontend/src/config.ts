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
	CHANNELS: "/channels/available",
	CHANNEL_MESSAGES: (id: string) => `/channels/${id}/messages`,
	JOIN_CHANNEL: (id: string) => `/channels/${id}/join`,
};

const ERROR_MESSAGES = {
	UNKNOWN_ERROR: "An unknown error occured.",
	INVALID_CHANNEL_ID: "The channel ID is invalid.",
};

enum ChatEvent {
	MESSAGE = "message",
	CHANNEL_MESSAGE = "channel:message",
	NOTIFICATION = "notification",
	NOTIFICATION_INVITE = "notification:invite",
	CHANNEL_VISIBLE = "channel:visible",
	CHANNEL_INVISIBLE = "channel:invisible",
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
