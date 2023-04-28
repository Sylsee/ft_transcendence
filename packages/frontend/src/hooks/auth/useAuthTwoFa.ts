import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { authTwoFa } from "api/auth/2fa/2faRequests";
import { ApiErrorResponse } from "types/global/global";

const useAuthTwoFa = (): UseMutationResult<void, ApiErrorResponse, string> => {
	const mutation = useMutation<void, ApiErrorResponse, string>(
		(code: string) => authTwoFa(code)
	);
	return mutation;
};

export { useAuthTwoFa };
