import { apiClient } from "api/api";
import { API_ROUTES } from "config";

// friends crud
const fetchFriends = async (userId: string) => {
	const response = await apiClient.get(API_ROUTES.USER_FRIENDS(userId));
	return response.data;
};

const fetchFriendStatus = async (userId: string) => {
	const response = await apiClient.get(API_ROUTES.USER_FRIEND_STATUS(userId));
	return response.data;
};

const deleteFriend = async (userId: string) => {
	const response = await apiClient.delete(API_ROUTES.USER_FRIEND(userId));
	return response.data;
};

// friends requests crud
const fetchFriendRequests = async () => {
	const response = await apiClient.get(API_ROUTES.USER_FRIENDS_REQUESTS);
	return response.data;
};

const sendFriendRequest = async (userId: string) => {
	const response = await apiClient.post(
		API_ROUTES.USER_FRIEND_REQUEST(userId)
	);
	return response.data;
};

const approveFriendRequest = async (userId: string) => {
	const response = await apiClient.patch(
		API_ROUTES.USER_FRIEND_REQUEST_APPROVE(userId)
	);
	return response.data;
};

const rejectFriendRequest = async (userId: string) => {
	const response = await apiClient.patch(
		API_ROUTES.USER_FRIEND_REQUEST_REJECT(userId)
	);
	return response.data;
};

const deleteFriendRequest = async (userId: string) => {
	const response = await apiClient.delete(
		API_ROUTES.USER_FRIEND_REQUEST(userId)
	);
	return response.data;
};

// block request crud
const fetchBlockedUsers = async () => {
	const response = await apiClient.get(API_ROUTES.USERS_BLOCKED);
	return response.data;
};

const blockUser = async (userId: string) => {
	const response = await apiClient.post(API_ROUTES.USER_BLOCKED(userId));
	return response.data;
};

const unblockUser = async (userId: string) => {
	const response = await apiClient.delete(API_ROUTES.USER_BLOCKED(userId));
	return response.data;
};

export {
	fetchFriendStatus,
	fetchFriends,
	fetchFriendRequests,
	approveFriendRequest,
	rejectFriendRequest,
	sendFriendRequest,
	deleteFriendRequest,
	deleteFriend,
	fetchBlockedUsers,
	blockUser,
	unblockUser,
};
