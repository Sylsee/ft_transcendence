import { ErrorItem } from "components/Error/ErrorItem";
import { Loader } from "components/Loader/Loader";
import { ApiErrorResponse } from "types/global";
import { LoaderType } from "types/loader";
import { User } from "types/user";

interface FriendsListProps {
	isConnectedUser: boolean;
	title: string;
	status: "loading" | "error" | "success";
	error: ApiErrorResponse | null;
	data: User[] | undefined;
}

const FriendsList: React.FC<FriendsListProps> = ({
	isConnectedUser = false,
	title,
	data,
	status,
	error,
}) => {
	return (
		<div className="shadow-lg rounded-xl mb-7 flex flex-col">
			<div className="flex flex-col items-center h-[3rem] justify-center">
				<div>
					<p>{title}</p>
				</div>
			</div>
			<div className="flex flex-col max-h-32 overflow-y-auto">
				{status === "loading" && <Loader type={LoaderType.LineWave} />}
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
