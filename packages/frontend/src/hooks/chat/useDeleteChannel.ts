import {
	useMutation,
	UseMutationOptions,
	UseMutationResult,
} from "@tanstack/react-query";
import { deleteChannel } from "api/chat/chatRequests";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { removeChannelById } from "store/chat-slice/chat-slice";
import { ApiErrorResponse } from "types/global/global";
import { MutationContextIdType } from "types/userRelations/api";

const useDeleteChannel = (): UseMutationResult<
	void,
	ApiErrorResponse,
	string
> => {
	const dispatch = useDispatch();

	const options: UseMutationOptions<
		void,
		ApiErrorResponse,
		string,
		MutationContextIdType
	> = {
		mutationFn: (id: string) => deleteChannel(id),
		onMutate: (id: string) => {
			return { id };
		},
		onSuccess: (_data, _variables, context) => {
			if (!context || !context.id) return;
			dispatch(removeChannelById(context.id));
			toast.success("Channel deleted");
		},
		onError: (error: ApiErrorResponse) => {
			toast.error(error.message);
		},
	};

	const mutation = useMutation(options);
	return mutation;
};

export { useDeleteChannel };
