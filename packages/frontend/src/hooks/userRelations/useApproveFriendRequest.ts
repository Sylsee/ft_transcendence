import {
	useMutation,
	UseMutationOptions,
	UseMutationResult,
	useQueryClient,
} from "@tanstack/react-query";
import { approveFriendRequest } from "api/userRelations/userRelationsRequest";
import {
	cancelFriendQueries,
	invalidateFriendQueries,
	removeFriendRequestFromQuery,
} from "hooks/userRelations/utils/queryUtils";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ApiErrorResponse, RootState } from "types/global/global";
import { MutationContextIdType } from "../../types/userRelations/api";
import { FriendRequestType } from "../../types/userRelations/userRelations";

const useApproveFriendRequest = (): UseMutationResult<
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
		mutationFn: (id: string) => approveFriendRequest(id),
		onMutate: (userId: string) => {
			const id =
				connectedUserId && currentId === connectedUserId
					? connectedUserId
					: userId;

			cancelFriendQueries(queryClient, id, connectedUserId);
			if (id === connectedUserId)
				removeFriendRequestFromQuery(
					queryClient,
					userId,
					FriendRequestType.Received
				);
			return { id };
		},
		onSuccess: (_data, _variables, context) => {
			if (!context || !context.id || currentId === connectedUserId)
				return;
			queryClient.invalidateQueries(["profile", context.id]);
		},
		onError: (error, variables, context) => {
			toast.error(error.message);
		},
		onSettled: (_data, _error, _variables, context) => {
			if (!context || !context.id) return;
			invalidateFriendQueries(queryClient, context.id, connectedUserId);
		},
	};
	const mutation = useMutation(options);
	return mutation;
};

export { useApproveFriendRequest };
