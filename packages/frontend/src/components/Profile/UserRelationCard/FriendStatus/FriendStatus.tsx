import { UserRowButton } from "components/Profile/UserRelationCard/UserList/UserRow/Buttons/UserRowButton";
import { useApproveFriendRequest } from "hooks/userRelations/useApproveFriendRequest";
import { useBlockUser } from "hooks/userRelations/useBlockUser";
import { useDeleteFriend } from "hooks/userRelations/useDeleteFriend";
import { useDeleteFriendRequest } from "hooks/userRelations/useDeleteFriendRequest";
import { useFetchFriendStatus } from "hooks/userRelations/useFetchFriendStatus";
import { useRejectFriendRequest } from "hooks/userRelations/useRejectFriendRequest";
import { useSendFriendRequest } from "hooks/userRelations/useSendFriendRequest";
import { useUnblockUser } from "hooks/userRelations/useUnblockUser";
import React from "react";
import { FriendStatusType } from "types/user/user";

interface FriendStatusProps {
	id: string;
}

const FriendStatus: React.FC<FriendStatusProps> = ({ id }) => {
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

	console.log(data);

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

	return (
		<div
			className="shadow-lg  rounded-xl mb-flex-wrap flex min-h-24 items-center justify-center"
			style={{ minHeight: "5rem" }}
		>
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
