import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { updateUserById } from "../../api/user/userRequests";
import { setUser } from "../../store/selfUser-slice/selfUser-slice";
import { UpdateUserRequest } from "../../types/user";

const useUpdateUser = (id: string) => {
	const dispatch = useDispatch();
	const mutation = useMutation(
		(data: UpdateUserRequest) => updateUserById(id, data),
		{
			onSuccess: (user) => {
				console.log("USER", user, "updated");
				dispatch(setUser(user));
			},
			onError: (error) => {
				console.error(error);
			},
		}
	);

	return mutation;
};

export { useUpdateUser };
