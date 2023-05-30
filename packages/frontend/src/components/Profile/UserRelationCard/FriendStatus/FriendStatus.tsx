import { UserRowButton } from "components/Profile/UserRelationCard/UserList/UserRow/Buttons/UserRowButton";
import { useApproveFriendRequest } from "hooks/userRelations/useApproveFriendRequest";
import { useBlockUser } from "hooks/userRelations/useBlockUser";
import { useDeleteFriend } from "hooks/userRelations/useDeleteFriend";
import { useDeleteFriendRequest } from "hooks/userRelations/useDeleteFriendRequest";
import { useFetchFriendStatus } from "hooks/userRelations/useFetchFriendStatus";
import { useRejectFriendRequest } from "hooks/userRelations/useRejectFriendRequest";
import { useSendFriendRequest } from "hooks/userRelations/useSendFriendRequest";
import { useUnblockUser } from "hooks/userRelations/useUnblockUser";
import React, { useCallback, useEffect } from "react";

import { useCreateChannel } from "hooks/chat/useCreateChannel";
import { useDispatch, useSelector } from "react-redux";
import {
	selectDirectMessageChannel,
	setActiveChannel,
	setShowChat,
	setShowChatModal,
} from "store/chat-slice/chat-slice";
import { ChannelType } from "types/chat/chat";
import { RootState } from "types/global/global";
import { FriendStatusType } from "../../../../types/userRelations/userRelations";

interface FriendStatusProps {
	id: string;
}

const FriendStatus: React.FC<FriendStatusProps> = ({ id }) => {
	// redux
	const dispatch = useDispatch();
	const directMessageChannel = useSelector((state: RootState) =>
		selectDirectMessageChannel(state, id)
	);

	// queries
	const { data } = useFetchFriendStatus(id);

	// mutations
	const { mutate: sendFriendRequestMutate } = useSendFriendRequest();
	const { mutate: acceptFriendRequestMutate } = useApproveFriendRequest();
	const { mutate: rejectFriendRequestMutate } = useRejectFriendRequest();
	const { mutate: deleteFriendMutate } = useDeleteFriend();
	const { mutate: cancelFriendRequestMutate } = useDeleteFriendRequest();
	const { mutate: unBlockUserMutate } = useUnblockUser();
	const { mutate: blockUserMutate } = useBlockUser();
	const { mutate: createChannelMutate, status: createChannelStatus } =
		useCreateChannel();

	const openChat = useCallback(() => {
		if (window.innerWidth > 1280) {
			dispatch(setShowChat(true));
		} else {
			dispatch(setShowChatModal(true));
		}
	}, [dispatch]);

	// hooks
	useEffect(() => {
		if (createChannelStatus === "success") {
			openChat();
		}
	}, [createChannelStatus, openChat]);

	const getButtonsProps = () => {
		if (!data || data.status === undefined) return {};
		let buttons = [];

		switch (data.status) {
			case FriendStatusType.NotFriends:
				buttons.push({
					name: "Add Friend",
					color: "astronaut",
					handleClick: () => {
						sendFriendRequestMutate(id);
					},
				});
				break;
			case FriendStatusType.FriendRequestSent:
				buttons.push({
					name: "Cancel Friend Request",
					color: "tamarillo",
					handleClick: () => {
						cancelFriendRequestMutate(id);
					},
				});
				break;

			case FriendStatusType.FriendRequestReceived:
				buttons.push({
					name: "Accept",
					color: "silver-tree",
					handleClick: () => {
						acceptFriendRequestMutate(id);
					},
				});
				buttons.push({
					name: "Decline",
					color: "tamarillo",
					handleClick: () => {
						rejectFriendRequestMutate(id);
					},
				});
				break;

			case FriendStatusType.Friends:
				buttons.push({
					name: "Remove Friend",
					color: "tamarillo",
					handleClick: () => {
						deleteFriendMutate(id);
					},
				});
				break;
			case FriendStatusType.Block:
				buttons.push({
					name: "UnBlock",
					color: "tamarillo",
					handleClick: () => {
						unBlockUserMutate(id);
					},
				});
				break;
			default:
				break;
		}
		if (
			data.status !== FriendStatusType.Block &&
			data.status !== FriendStatusType.Pending
		)
			buttons.push({
				name: "Block",
				color: "tamarillo",
				handleClick: () => {
					blockUserMutate(id);
				},
			});

		return { buttons };
	};

	const buttonPropsList = getButtonsProps();

	// handlers
	const handleClickMessage = () => {
		if (directMessageChannel) {
			dispatch(setActiveChannel(directMessageChannel.id));
			openChat();
		} else {
			createChannelMutate({
				type: ChannelType.Direct_message,
				otherUserId: id,
			});
		}
	};

	return (
		<div
			className="flex items-center justify-center flex-wrap overflow-auto"
			style={{ minHeight: "5rem" }}
		>
			<UserRowButton
				name="Message"
				color="astronaut"
				handleClick={handleClickMessage}
			/>
			{buttonPropsList.buttons?.map((button, index) => (
				<UserRowButton
					key={index}
					name={button.name}
					color={button.color}
					handleClick={button.handleClick}
				/>
			))}
		</div>
	);
};

export { FriendStatus };
