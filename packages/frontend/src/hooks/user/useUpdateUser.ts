import {
	useMutation,
	UseMutationResult,
	useQueryClient,
} from "@tanstack/react-query";
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
	const queryClient = useQueryClient();

	const dispatch = useDispatch();
	const mutation = useMutation<User, ApiErrorResponse, UpdateUserRequest>(
		(data: UpdateUserRequest) => updateUserById(data),
		{
			onSuccess: (user) => {
				dispatch(setUser(user));
				queryClient.invalidateQueries(["matchHistory", user.id]);
			},
		}
	);
	return mutation;
};

export { useUpdateUser };
