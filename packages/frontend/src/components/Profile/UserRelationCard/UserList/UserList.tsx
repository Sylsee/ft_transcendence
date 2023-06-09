import { ErrorItem } from "components/Error/ErrorItem";
import { UserRow } from "components/Profile/UserRelationCard/UserList/UserRow/UserRow";
import { useApproveFriendRequest } from "hooks/userRelations/useApproveFriendRequest";
import { useDeleteFriend } from "hooks/userRelations/useDeleteFriend";
import { useDeleteFriendRequest } from "hooks/userRelations/useDeleteFriendRequest";
import { useRejectFriendRequest } from "hooks/userRelations/useRejectFriendRequest";
import { useUnblockUser } from "hooks/userRelations/useUnblockUser";
import { toast } from "react-toastify";
import { emitLobbySocketEvent } from "sockets/socket";
import { LobbySendEvent } from "types/game/lobby";
import { ApiErrorResponse } from "types/global/global";
import {
	FriendRequest,
	UserListType,
} from "../../../../types/userRelations/userRelations";

interface UserListProps {
	type: UserListType;
	isConnectedUser?: boolean;
	status: "loading" | "error" | "success";
	error: ApiErrorResponse | null;
	users: FriendRequest[] | undefined;
}

const UserList: React.FC<UserListProps> = ({
	isConnectedUser = true,
	type,
	users,
	status,
	error,
}) => {
	const { mutate: acceptFriendRequestMutate } = useApproveFriendRequest();
	const { mutate: rejectFriendRequestMutate } = useRejectFriendRequest();
	const { mutate: deleteFriendMutate } = useDeleteFriend();
	const { mutate: cancelFriendRequestMutate } = useDeleteFriendRequest();
	const { mutate: unBlockUserMutate } = useUnblockUser();

	const title = () => {
		switch (type) {
			case UserListType.FriendList:
				return "Friends";
			case UserListType.ReceivedFriendRequests:
				return "Friends Requests Received";
			case UserListType.SentFriendRequests:
				return "Friends Requests Sent";
			case UserListType.BlockedUsers:
				return "Blocked Users";
			case UserListType.InviteToLobby:
				return "Invite Friends";
			default:
				return "";
		}
	};

	const getButtonsProps = () => {
		if (!isConnectedUser) return {};

		switch (type) {
			case UserListType.FriendList:
				return {
					buttons: [
						{
							name: "Remove Friend",
							color: "tamarillo",
							handleClick: (id: string) => {
								deleteFriendMutate(id);
							},
						},
					],
				};
			case UserListType.ReceivedFriendRequests:
				return {
					buttons: [
						{
							name: "Accept",
							color: "silver-tree",
							handleClick: (id: string) => {
								acceptFriendRequestMutate(id);
							},
						},
						{
							name: "Decline",
							color: "tamarillo",
							handleClick: (id: string) => {
								rejectFriendRequestMutate(id);
							},
						},
					],
				};
			case UserListType.SentFriendRequests:
				return {
					buttons: [
						{
							name: "Cancel",
							color: "tamarillo",
							handleClick: (id: string) => {
								cancelFriendRequestMutate(id);
							},
						},
					],
				};
			case UserListType.BlockedUsers:
				return {
					buttons: [
						{
							name: "Unblock",
							color: "silver-tree",
							handleClick: (id: string) => {
								unBlockUserMutate(id);
							},
						},
					],
				};
			case UserListType.InviteToLobby:
				return {
					buttons: [
						{
							name: "Invite",
							color: "silver-tree",
							handleClick: (id: string) => {
								emitLobbySocketEvent(
									LobbySendEvent.InviteToLobby,
									{ userId: id }
								);
								toast.info("Invitation sent");
							},
						},
					],
				};
			default:
				return {};
		}
	};

	const buttonPropsList = getButtonsProps();

	return (
		<>
			<div className="flex flex-col items-center h-[3rem] justify-center ">
				<div>
					<p className="font-bold text-xl">{title()}</p>
				</div>
			</div>
			<div className="flex flex-col overflow-auto w-full grow ">
				<div className="flex flex-col  grow">
					{status === "error" && <ErrorItem error={error} />}
					<div className="grow overflow-auto">
						{status === "success" &&
							users?.map((user: FriendRequest) => (
								<UserRow
									key={user.id}
									user={user}
									buttonPropsList={buttonPropsList}
								/>
							))}
					</div>
				</div>
			</div>
		</>
	);
};

export { UserList };
