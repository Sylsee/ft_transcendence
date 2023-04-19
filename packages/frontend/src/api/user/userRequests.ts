import { API_ROUTES } from "../../config";
import { UpdateUserRequest } from "../../types/user";
import { apiClient } from "../api";

const fetchUserById = async (userId: string) => {
	const response = await apiClient.get(API_ROUTES.USER(userId));
	return response.data;
};

const updateUserById = async (userId: string, data: UpdateUserRequest) => {
	const formData = new FormData();
	if (data.name) {
		formData.append("name", data.name);
	}
	if (data.avatar) {
		formData.append("avatar", data.avatar);
	}

	const response = await apiClient.patch(API_ROUTES.USER(userId), formData);
	return response.data;
};

export { fetchUserById, updateUserById };
