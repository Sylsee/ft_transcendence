import { LoaderType } from "../../../../types/loader";
import { User } from "../../../../types/user";
import { ErrorItem } from "../../../Error/ErrorItem";
import { Loader } from "../../../Loader/Loader";

interface FriendsListProps {
	id: string;
	isConnectedUser: boolean;
	title: string;
	status: "loading" | "error" | "success";
	error: Error | null;
	data: User[] | undefined;
}

const FriendsList: React.FC<FriendsListProps> = ({
	id,
	isConnectedUser = false,
	title,
	data,
	status,
	error,
}) => {
	return (
		<div className="border-solid border-2 mb-7 flex flex-col">
			<div className="flex flex-col items-center h-[3rem] justify-center">
				<div>
					<p>{title}</p>
				</div>
			</div>
			<div className="flex flex-col max-h-32 overflow-y-auto">
				{status === "loading" && <Loader type={LoaderType.LINEWAVE} />}
				{status === "error" && <ErrorItem error={error} />}
				{status === "success" &&
					Array.isArray(data) && // TODO remove this check when the backend will be fixed
					data?.map((friend: User) => (
						<div key={friend.id}>
							<p>{friend.name}</p>
						</div>
					))}
			</div>
		</div>
	);
};

export { FriendsList };
