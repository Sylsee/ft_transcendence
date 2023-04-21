import { API_ROUTES } from "../../../config";
import { apiClient } from "../../api";

const fetchGenerateTwoFa = async () => {
	const response = await apiClient.post(API_ROUTES.GENERATE_2FA);
	return response.data;
};

const enableTwoFa = async (code: string) => {
	const response = await apiClient.post(API_ROUTES.ENABLE_2FA, { code });
	return response.data;
};

const disableTwoFa = async (code: string) => {
	const response = await apiClient.post(API_ROUTES.DISABLE_2FA, { code });
	return response.data;
};

const authTwoFa = async (code: string) => {
	const response = await apiClient.post(API_ROUTES.VERIFY_2FA, { code });
	return response.data;
};

export { fetchGenerateTwoFa, enableTwoFa, disableTwoFa, authTwoFa };
