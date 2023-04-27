import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { leaveChannel } from "../../api/chat/chatRequests";
import { Channel } from "../../types/chat";
import { ApiErrorResponse } from "../../types/global";

const useLeaveChannel = (
	id: string
): UseMutationResult<Channel, ApiErrorResponse, void> => {
	const mutation = useMutation<Channel, ApiErrorResponse, void>(
		() => leaveChannel(id),
		{
			onError: (error: ApiErrorResponse) => {
				toast.error(error.message);
			},
		}
	);

	return mutation;
};

export { useLeaveChannel };
