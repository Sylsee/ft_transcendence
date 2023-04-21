import axios from "axios";
import { API_BASE_URL } from "../config";

const apiClient = axios.create({
	baseURL: `${API_BASE_URL}`,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

// apiClient.interceptors.request.use((config) => {
// 	const cookie = Cookies.get(JWT_NAME);
// 	if (cookie) config.headers.Authorization = `Bearer ${cookie}`;
// 	return config;
// });

apiClient.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (error.response) {
			// The request was made and the server responded with a status code
			// that falls out of the range of 2xx
		} else if (error.request) {
			// The request was made but no response was received
		} else {
			// Something happened in setting up the request that triggered an Error
		}
		return Promise.reject(error.response.data);
	}
);

export { apiClient };
