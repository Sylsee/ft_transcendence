import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { joinChannel } from "../../api/chat/chatRequests";
import { ERROR_MESSAGES } from "../../config";
import { updateChannel } from "../../store/chat-slice/chat-slice";
import { JoinChannelRequest } from "../../types/chat";

const useJoinChannel = (id: string | undefined) => {
	const dispatch = useDispatch();

	const mutation = useMutation(
		(data: JoinChannelRequest) => {
			if (!id) {
				return Promise.reject(
					new Error(ERROR_MESSAGES.INVALID_CHANNEL_ID)
				);
			}
			return joinChannel(id, data);
		},
		{
			onSuccess: (channel) => {
				console.log("JOIN CHANNEL YO:", channel);
				dispatch(updateChannel(channel));
			},
			onError: (error) => {
				console.error("BIG FAIL", error);
			},
			retry: 1,
		}
	);
	return mutation;
};

export { useJoinChannel };
