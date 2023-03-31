const API_BASE_URL: string = `http://localhost:3000`;

const API_ROUTES = {
	AUTH_42: "/auth/42",
	AUTH_GOOGLE: "/auth/google",
	USER: (id: string) => `/users/${id}`,
	USER_STATS: (id: string) => `/users/stats/${id}`,
	USER_MATCH_HISTORY: (id: string) => `/users/match-history/${id}`,
	USER_FRIENDS: (id: string) => `/users/friends/${id}`,
	USER_FRIENDS_REQUESTS: (id: string) => `/users/friends-requests/${id}`,
	USER_FRIEND_STATUS: (id: string) => `/users/friend-status/${id}`,
};

const ERROR_MESSAGES = {
	UNKNOWN_ERROR: "An unknown error occured.",
};

const JWT_NAME = "token";

export { API_BASE_URL, API_ROUTES, ERROR_MESSAGES, JWT_NAME };
