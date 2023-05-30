import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { createChannel } from "api/chat/chatRequests";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addChannel, setActiveChannel } from "store/chat-slice/chat-slice";
import { CreateChannelRequest } from "types/chat/chat";
import { ApiErrorResponse } from "types/global/global";
import { ChannelPayload } from "types/socket/socket";

const useCreateChannel = (): UseMutationResult<
	ChannelPayload,
	ApiErrorResponse,
	CreateChannelRequest
> => {
	const dispatch = useDispatch();

	const mutation = useMutation<
		ChannelPayload,
		ApiErrorResponse,
		CreateChannelRequest
	>((newChannel: CreateChannelRequest) => createChannel(newChannel), {
		onSuccess: (channel: ChannelPayload) => {
			dispatch(addChannel(channel));
			dispatch(setActiveChannel(channel.id));
			toast.success(`Channel ${channel.name} created!`);
		},
		onError: (error: ApiErrorResponse) => {
			toast.error(error.message);
		},
	});
	return mutation;
};

export { useCreateChannel };
