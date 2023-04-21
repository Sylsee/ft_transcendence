import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { disableTwoFa, enableTwoFa } from "../../api/auth/2fa/2faRequests";
import { setTwoFactorAuthEnabled } from "../../store/auth-slice/auth-slice";
import { ApiErrorResponse } from "../../types/global";

const useToggleTwoFa = (
	isTwoFactorAuthEnabled: boolean
): UseMutationResult<void, ApiErrorResponse, string> => {
	const dispatch = useDispatch();

	const mutation = useMutation<void, ApiErrorResponse, string>(
		(code: string) =>
			isTwoFactorAuthEnabled ? disableTwoFa(code) : enableTwoFa(code),
		{
			onSuccess: () => {
				dispatch(setTwoFactorAuthEnabled(!isTwoFactorAuthEnabled));
				toast.success(
					`Two factor authentication ${
						isTwoFactorAuthEnabled ? "disabled" : "enabled"
					}`
				);
			},
		}
	);
	return mutation;
};

export { useToggleTwoFa };
