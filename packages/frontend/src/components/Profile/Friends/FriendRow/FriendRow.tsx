interface FriendRowProps {
	name: string;
	onClick?: () => void;
	isFriends: boolean;
}

const FriendRow: React.FC<FriendRowProps> = ({
	name,
	onClick,
	isFriends = false,
}) => {
	return (
		<div className="flex p-2 ">
			<div className="w-2/3">
				<p className="w-70%">
					{name} {isFriends ? "is your friend" : "has invited you"}
				</p>
			</div>
			{!isFriends ? (
				<div className="w-1/3 flex flex-col md:flex-row">
					<div className="w-full md:w-1/2">
						<button
							onClick={onClick}
							className="bg-green-700 border-solid border-2 rounded-lg w-[95%]"
						>
							Accept
						</button>
					</div>
					<div className="w-full md:w-1/2">
						<button
							onClick={onClick}
							className="bg-red-300 border-solid border-2 rounded-lg w-[95%]"
						>
							Decline
						</button>
					</div>
				</div>
			) : (
				<div className="w-1/3 flex justify-center">
					<div className="w-full md:w-1/2">
						<button
							onClick={onClick}
							className="bg-red-300 border-solid border-2 rounded-lg w-[95%]"
						>
							Remove
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export { FriendRow };
