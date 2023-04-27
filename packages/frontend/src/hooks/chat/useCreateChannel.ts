import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { createChannel } from "../../api/chat/chatRequests";
import {
	addChannel,
	setActiveChannel,
} from "../../store/chat-slice/chat-slice";
import { CreateChannelRequest } from "../../types/chat";
import { ApiErrorResponse } from "../../types/global";
import { ChannelPayload } from "../../types/socket";

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
		onSuccess: (channel) => {
			dispatch(addChannel(channel));
			dispatch(setActiveChannel(channel.id));
			toast.success(`Channel ${channel.name} created!`);
		},
	});
	return mutation;
};

export { useCreateChannel };
