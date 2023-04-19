import { useMutation } from "@tanstack/react-query";
import { fetchGenerateTwoFa } from "../../api/auth/2fa/2faRequests";

const useGenerateTwoFa = () => {
	const mutation = useMutation(fetchGenerateTwoFa, {
		onSuccess: (data) => {
			console.log(data);
		},
		onSettled: (data, error) => {
			if (error) {
				console.log(error);
			}
			if (data) {
				console.log(data);
			}
		},
	});
	return {
		data: mutation.data,
		mutate: mutation.mutate,
		status: mutation.status,
		error: mutation.error,
	};
};

export { useGenerateTwoFa };
