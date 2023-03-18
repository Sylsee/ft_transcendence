import axios from "axios";

export async function authenticateUser(): Promise<void> {
	try {
		const response = await axios.get(`/api/authenticate`);
		console.log(response);
	} catch (error) {}
}
