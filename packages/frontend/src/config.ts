export const API_BASE_URL: string = `http://localhost:3000`;
export const SOCKET_BASE_URL: string = `http://localhost:3000/chat`;

export const API_ROUTES = {
	AUTH_42: "/auth/42",
	AUTH_GOOGLE: "/auth/google",
	GENERATE_2FA: "/auth/2fa/generate",
	ENABLE_2FA: "/auth/2fa/enable",
	DISABLE_2FA: "/auth/2fa/disable",
	VERIFY_2FA: "/auth/2fa/authenticate",
	USER: (id: string) => `/users/user/${id}`,
	UPDATE_USER: `/users`,
	USER_FRIEND_STATUS: (id: string) => `/users/friend-status/${id}`,
	USER_FRIENDS: (id: string) => `/users/friends/${id}`,
	USER_FRIEND: (id: string) => `/users/friend/${id}`,
	USER_FRIEND_REQUEST: (id: string) => `/users/friend-request/${id}`,
	USER_FRIEND_REQUEST_APPROVE: (id: string) =>
		`/users/friend-request/${id}/approve`,
	USER_FRIEND_REQUEST_REJECT: (id: string) =>
		`/users/friend-request/${id}/reject`,
	USER_FRIENDS_REQUESTS: "/users/friend-request",
	USER_BLOCKED: (id: string) => `/users/block/${id}`,
	USERS_BLOCKED: "/users/block",
	USER_PROFILE_PICTURE: `/users/profile-picture`,
	USER_MATCH_HISTORY: (id: string) => `/users/match-history/${id}`,
	USER_MATCH_STATS: (id: string) => `/users/match-stats/${id}`,
	CHANNELS: "/channels/available",
	CHANNEL_MESSAGES: (id: string) => `/channels/${id}/messages`,
	JOIN_CHANNEL: (id: string) => `/channels/${id}/join`,
	LEAVE_CHANNEL: (id: string) => `/channels/${id}/leave`,
	CREATE_CHANNEL: "/channels/create",
	UPDATE_CHANNEL: (id: string) => `/channels/update/${id}`,
	DELETE_CHANNEL: (id: string) => `/channels/delete/${id}`,
};

export const ERROR_MESSAGES = {
	UNKNOWN_ERROR: "An unknown error occured.",
	INVALID_CHANNEL_ID: "The channel ID is invalid.",
};

export enum ChatEvent {
	Message = "message",
	ChannelMessage = "channel:message",
	ChannelServerMessage = "channel:server_message",
	Notification = "notification",
	NotificationInvite = "notification:invite",
	ChannelAvailable = "channel:available",
	ChannelUnavailability = "channel:unavailable",
	Exception = "exception",
}

export enum UserEvent {
	Status = "user.status",
}

export const JWT_NAME = "access_token";
