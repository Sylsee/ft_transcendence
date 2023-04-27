import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchChannelMessages } from "api/chat/chatRequests";
import { useDispatch } from "react-redux";
import { setMessages } from "store/chat-slice/chat-slice";
import { Message } from "types/chat";
import { ApiErrorResponse } from "types/global";

const useMessageQuery = (
	channelId: string | undefined
): UseQueryResult<Message[], ApiErrorResponse> => {
	const dispatch = useDispatch();
	const query = useQuery<Message[], ApiErrorResponse>(
		["messages", channelId],
		() => (channelId ? fetchChannelMessages(channelId) : []),
		{
			enabled: false,
			onSuccess: (messages) => {
				if (!channelId) return;
				dispatch(
					setMessages({
						channelId: channelId,
						messages,
					})
				);
			},
		}
	);
	return query;
};

export { useMessageQuery };
