import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { leaveChannel } from "api/chat/chatRequests";
import { toast } from "react-toastify";
import { Channel } from "types/chat/chat";
import { ApiErrorResponse } from "types/global/global";

const useLeaveChannel = (): UseMutationResult<
	Channel,
	ApiErrorResponse,
	string
> => {
	const mutation = useMutation<Channel, ApiErrorResponse, string>(
		(id: string) => leaveChannel(id),
		{
			onError: (error: ApiErrorResponse) => {
				toast.error(error.message);
			},
		}
	);

	return mutation;
};

export { useLeaveChannel };
