import {
	useMutation,
	UseMutationOptions,
	UseMutationResult,
	useQueryClient,
} from "@tanstack/react-query";
import { blockUser } from "api/userRelations/userRelationsRequest";
import {
	cancelFriendQueries,
	invalidateFriendQueries,
} from "hooks/userRelations/utils/queryUtils";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ApiErrorResponse, RootState } from "types/global/global";

import { MutationContextIdType } from "../../types/userRelations/api";

const useBlockUser = (): UseMutationResult<void, ApiErrorResponse, string> => {
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
		mutationFn: (id: string) => blockUser(id),
		onMutate: (userId: string) => {
			const id =
				connectedUserId && currentId === connectedUserId
					? connectedUserId
					: userId;

			cancelFriendQueries(queryClient, id, connectedUserId);
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

export { useBlockUser };
