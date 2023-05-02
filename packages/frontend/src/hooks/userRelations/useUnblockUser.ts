import {
	useMutation,
	UseMutationOptions,
	UseMutationResult,
	useQueryClient,
} from "@tanstack/react-query";
import { unblockUser } from "api/userRelations/userRelationsRequest";
import {
	cancelFriendQueries,
	invalidateFriendQueries,
	removeBlockedUserFromQuery,
} from "hooks/userRelations/utils/queryUtils";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ApiErrorResponse, RootState } from "types/global/global";
import { MutationContextIdType } from "types/user/user";

const useUnblockUser = (): UseMutationResult<
	void,
	ApiErrorResponse,
	string
> => {
	const queryClient = useQueryClient();
	const connectedUserId = useSelector(
		(state: RootState) => state.USER.user?.id
	);
	const { id: currentId } = useParams<{ id: string }>();

	const options: UseMutationOptions<
		void,
		ApiErrorResponse,
		string,
		MutationContextIdType
	> = {
		mutationFn: (id: string) => unblockUser(id),
		onMutate: (userId: string) => {
			const id =
				connectedUserId && currentId === connectedUserId
					? connectedUserId
					: userId;

			cancelFriendQueries(queryClient, id, connectedUserId);
			if (id === connectedUserId)
				removeBlockedUserFromQuery(queryClient, userId);
			return { id };
		},
		onError: (error) => {
			toast.error(error.message);
		},
		onSettled: (_data, _error, _variables, context) => {
			if (!context || !context.id || currentId === connectedUserId)
				return;
			invalidateFriendQueries(queryClient, context.id, connectedUserId);
		},
	};
	const mutation = useMutation(options);
	return mutation;
};

export { useUnblockUser };
