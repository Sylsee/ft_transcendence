import axios from "axios";
import { BACKEND_URL } from "../../config";

export async function authenticateUser(): Promise<void> {
	try {
		const response = await axios.get(`${BACKEND_URL}/auth/login`);

		console.log(response);
		if (response.status === 200) return response.data;
		else throw new Error("Error while authenticating user");
	} catch (error) {}
}
