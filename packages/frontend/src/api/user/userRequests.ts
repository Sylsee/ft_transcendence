import { API_ROUTES } from "../../config";
import { UpdateUserRequest } from "../../types/user";
import { apiClient } from "../api";

const fetchUserById = async (userId: string) => {
	const response = await apiClient.get(API_ROUTES.USER(userId));
	return response.data;
};

const updateUserById = async (userId: string, data: UpdateUserRequest) => {
	const response = await apiClient.patch(API_ROUTES.USER(userId), data);
	return response.data;
};

const uploadProfilePicture = async (file: File) => {
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

export { fetchUserById, updateUserById, uploadProfilePicture };
