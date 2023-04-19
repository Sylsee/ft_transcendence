import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { fetchChannelMessages } from "../../api/chat/chatRequests";
import { updateChannel } from "../../store/chat-slice/chat-slice";

const useMessageQuery = (channelId: string | undefined) => {
	const dispatch = useDispatch();
	const { refetch: refetchMessage } = useQuery(
		["messages", channelId],
		() => (channelId ? fetchChannelMessages(channelId) : null),
		{
			enabled: false,
			onSuccess: (messages) => {
				if (!channelId) return;
				console.log("messages", messages);
				dispatch(
					updateChannel({
						id: channelId,
						hasBeenFetched: true,
						messages,
					})
				);
			},
		}
	);
	return { refetchMessage };
};

export { useMessageQuery };
