import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { joinChannel } from "../../api/chat/chatRequests";
import {
	addChannel,
	setActiveChannel,
} from "../../store/chat-slice/chat-slice";
import { JoinChannelRequest } from "../../types/chat";
import { ApiErrorResponse } from "../../types/global";
import { ChannelPayload } from "../../types/socket";

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
