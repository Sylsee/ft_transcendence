import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { fetchChannels } from "../../api/chat/chatRequests";
import { setChannels } from "../../store/chat-slice/chat-slice";
import { Channel } from "../../types/chat";
import { ApiErrorResponse } from "../../types/global";

const useFetchChannels = (): UseQueryResult<Channel[], ApiErrorResponse> => {
	const dispatch = useDispatch();
	const query = useQuery<Channel[], ApiErrorResponse>(
		["channels"],
		fetchChannels,
		{
			onSuccess: (channels: Channel[]) => {
				dispatch(setChannels(channels));
			},
			refetchOnWindowFocus: false,
		}
	);

	return query;
};

export { useFetchChannels };
