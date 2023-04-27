import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updateChannel } from "../../api/chat/chatRequests";
import { updateChannelSafety } from "../../store/chat-slice/chat-slice";
import { CreateChannelRequest } from "../../types/chat";
import { ApiErrorResponse } from "../../types/global";
import { ChannelPayload } from "../../types/socket";

const useUpdateChannel = (
	id: string | undefined
): UseMutationResult<
	ChannelPayload,
	ApiErrorResponse,
	CreateChannelRequest
> => {
	const dispatch = useDispatch();
	const error: ApiErrorResponse = {
		error: 401,
		message: ["Can't find channel"],
		statusCode: 401,
	};

	const mutation = useMutation<
		ChannelPayload,
		ApiErrorResponse,
		CreateChannelRequest
	>(
		(newChannel: CreateChannelRequest) => {
			if (!id) return Promise.reject(error);
			return updateChannel(id, newChannel);
		},
		{
			onSuccess: (channel) => {
				dispatch(updateChannelSafety(channel));
				toast.success(`Channel ${channel.name} updated!`);
			},
		}
	);

	return mutation;
};

export { useUpdateChannel };
