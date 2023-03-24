import { FriendRow } from "./FriendRow/FriendRow";

interface FriendsProps {
	title: string;
	isFriends: boolean;
}

const Friends: React.FC<FriendsProps> = ({ title, isFriends }) => {
	return (
		<div className="border-solid border-2 mb-7 flex flex-col bg-blue-gray-400 w-full">
			<div className="flex flex-col items-center h-[3rem] justify-center">
				<div>
					<p>{title}</p>
				</div>
			</div>
			<div className="flex flex-col max-h-32 overflow-y-auto">
				<FriendRow
					name="jean"
					onClick={() => {}}
					isFriends={isFriends}
				/>
			</div>
		</div>
	);
};

export { Friends };
