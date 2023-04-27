import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { deleteChannel } from "../../api/chat/chatRequests";
import { removeChannelById } from "../../store/chat-slice/chat-slice";
import { ApiErrorResponse } from "../../types/global";

const useDeleteChannel = (
	id: string
): UseMutationResult<void, ApiErrorResponse, void> => {
	const dispatch = useDispatch();

	const mutation = useMutation<void, ApiErrorResponse, void>(
		() => deleteChannel(id),
		{
			onSuccess: () => {
				dispatch(removeChannelById(id));
				toast.success("Channel deleted");
			},
			onError: (error: ApiErrorResponse) => {
				toast.error(error.message);
			},
		}
	);

	return mutation;
};

export { useDeleteChannel };
