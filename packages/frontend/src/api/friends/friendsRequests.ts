import { API_ROUTES } from "../../config";
import { apiClient } from "../api";

const fetchFriendsList = async (userId: string) => {
	const response = await apiClient.get(API_ROUTES.USER_FRIENDS(userId));
	return response;
};

const fetchFriendsRequests = async (userId: string) => {
	const response = await apiClient.get(
		API_ROUTES.USER_FRIENDS_REQUESTS(userId)
	);
	return response;
};

export { fetchFriendsList, fetchFriendsRequests };
