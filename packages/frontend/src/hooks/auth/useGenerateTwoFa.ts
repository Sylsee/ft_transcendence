import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { fetchGenerateTwoFa } from "../../api/auth/2fa/2faRequests";
import { ApiErrorResponse } from "../../types/global";

const useGenerateTwoFa = (): UseMutationResult<any, ApiErrorResponse, void> => {
	const mutation = useMutation<any, ApiErrorResponse, void>(
		fetchGenerateTwoFa
	);
	return mutation;
};

export { useGenerateTwoFa };
