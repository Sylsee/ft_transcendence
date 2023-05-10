import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { updateUserById } from "api/user/userRequests";
import { useDispatch } from "react-redux";
import { setUser } from "store/selfUser-slice/selfUser-slice";
import { ApiErrorResponse } from "types/global/global";
import { User } from "types/user/user";
import { UpdateUserRequest } from "../../types/user/api";

const useUpdateUser = (): UseMutationResult<
	User,
	ApiErrorResponse,
	UpdateUserRequest
> => {
	const dispatch = useDispatch();
	const mutation = useMutation<User, ApiErrorResponse, UpdateUserRequest>(
		(data: UpdateUserRequest) => updateUserById(data),
		{
			onSuccess: (user) => {
				dispatch(setUser(user));
			},
		}
	);
	return mutation;
};

export { useUpdateUser };
