import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { leaveChannel } from "api/chat/chatRequests";
import { toast } from "react-toastify";
import { Channel } from "types/chat/chat";
import { ApiErrorResponse } from "types/global/global";

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
