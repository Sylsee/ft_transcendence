import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { joinChannel } from "api/chat/chatRequests";
import { useDispatch } from "react-redux";
import { addChannel, setActiveChannel } from "store/chat-slice/chat-slice";
import { JoinChannelRequest } from "types/chat/chat";
import { ApiErrorResponse } from "types/global/global";
import { ChannelPayload } from "types/socket/socket";

const useJoinChannel = (): UseMutationResult<
	ChannelPayload,
	ApiErrorResponse,
	JoinChannelRequest
> => {
	const dispatch = useDispatch();

	const mutation = useMutation<
		ChannelPayload,
		ApiErrorResponse,
		JoinChannelRequest
	>(
		({ id, data }) => {
			return joinChannel(id, data);
		},
		{
			onSuccess: (channel) => {
				dispatch(addChannel(channel));
				dispatch(setActiveChannel(channel.id));
			},
			retry: 1,
		}
	);
	return mutation;
};

export { useJoinChannel };
