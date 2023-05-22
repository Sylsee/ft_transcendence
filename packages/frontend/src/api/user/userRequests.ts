import { apiClient } from "api/api";
import { API_ROUTES } from "config";

import { UpdateUserRequest } from "../../types/user/api";

export const fetchUserById = async (userId: string) => {
	const response = await apiClient.get(API_ROUTES.USER(userId));
	return response.data;
};

export const updateUserById = async (data: UpdateUserRequest) => {
	const response = await apiClient.patch(API_ROUTES.UPDATE_USER, data);
	return response.data;
};

export const uploadProfilePicture = async (file: File) => {
	const formData = new FormData();

	formData.append("profile-picture", file);

	const response = await apiClient.post(
		API_ROUTES.USER_PROFILE_PICTURE,
		formData,
		{
			headers: {
				"Content-Type": "multipart/form-data",
			},
		}
	);
	return response.data;
};

export const fetchUserMatchHistory = async (userId: string) => {
	const response = await apiClient.get(API_ROUTES.USER_MATCH_HISTORY(userId));
	return response.data;
};

export const fetchUserMatchStats = async (userId: string) => {
	const response = await apiClient.get(API_ROUTES.USER_MATCH_STATS(userId));
	return response.data;
};
