import { useMutation } from "@tanstack/react-query";
import { enableTwoFa } from "../../api/auth/2fa/2faRequests";

const useEnableTwoFa = () => {
	const mutation = useMutation((code: string) => enableTwoFa(code), {
		onSuccess: (data) => {
			console.log(data);
		},
	});
	return {
		mutate: mutation.mutate,
		status: mutation.status,
		error: mutation.error,
	};
};

export { useEnableTwoFa };
