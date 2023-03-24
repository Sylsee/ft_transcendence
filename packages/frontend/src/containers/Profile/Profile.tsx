import { useEffect, useState } from "react";
import { Friends } from "../../components/Profile/Friends/Friends";

const Profile = () => {
	const [user, setUser] = useState({
		name: "arguilla",
		bio: "I'm a software engineer",
		avatar: "path/to/avatar.png",
		friends: [
			{
				name: "friend1",
				avatar: "path/to/avatar.png",
			},
			{
				name: "friend2",
				avatar: "path/to/avatar.png",
			},
		],
		games: [
			{
				opponent: {
					name: "opponent1",
					avatar: "path/to/avatar.png",
				},
				result: "win",
				date: "2021-01-01",
			},
			{
				opponent: {
					name: "opponent2",
					avatar: "path/to/avatar.png",
				},
				result: "loss",
				date: "2021-01-01",
			},
		],
	});

	return (
		<div className="flex h-full bg-black justify-center">
			<div className="flex flex-col lg:flex-row w-full max-w-7xl bg-red-200">
				{/* profile avatar and basics infocrmations */}
				<div className="mt-10 flex flex-col lg:w-1/2 w-full bg-green-300 pt-2">
					<div className="flex justify-center h-1/2">
						<img
							className="rounded-full border-solid border-2 border-black max-h-80"
							src="https://gravatar.com/avatar/7f7f958bc277972e21fcf4a1d9a08da8?s=400&d=robohash&r=x"
							alt="User Avatar"
						/>
					</div>
					<div className="h-1/2 flex flex-col  items-center pt-5">
						<div>
							<div className="">
								<p>name: arguilla</p>
							</div>
							<div>
								<p>status: online</p>
							</div>
						</div>
					</div>
				</div>
				<div className="mt-10 flex flex-col lg:w-1/2 w-full bg-green-800 lg:p-10">
					<Friends title="Friends Requests" isFriends={false} />
					<Friends title="Friends" isFriends={true} />
					<div className="flex bg-blue-gray-400 w-full">
						<div className="flex flex-col">
							<p>Stats</p>
						</div>
					</div>
				</div>
			</div>
			{/* <div className=" max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col md:flex-row md:justify-center h-max">
					<div className="md:w-1/2 w-full flex flex-col  mb-6 md:mb-0 max-w-2xl border-solid border-2 border-black md:m-10 p-5">
						<div className="h-1/2 flex flex-row justify-center ">
							<img
								className="rounded-full border-solid border-2 border-black"
								src="https://gravatar.com/avatar/7f7f958bc277972e21fcf4a1d9a08da8?s=400&d=robohash&r=x"
								alt="User Avatar"
							/>
						</div>
						<div className="h-1/2 flex justify-center ">
							<div className="text-left">
								<h2 className="text-2xl font-bold mb-2 truncate">
									{user.name}
								</h2>
							</div>
						</div>
					</div>
					<div className="md:w-1/2 w-full flex flex-col items-start md:items-center justify-start md:justify-start max-w-2xl">
						<div className="w-full mb-6 md:mb-0">
							<h3 className="text-lg font-bold mb-2 truncate">
								Friend Requests
							</h3>
							<ul className="bg-white rounded-md shadow overflow-hidden divide-y divide-gray-200 max-h-52">
								<li className="px-4 py-3">
									<div className="flex items-center">
										<img
											className="w-10 h-10 rounded-full mr-4"
											src="path/to/avatar.png"
											alt="Friend Avatar"
										/>
										<div>
											<h4 className="text-lg font-bold truncate">
												Friend Name
											</h4>
											<p className="text-gray-500 max-w-sm truncate">
												Request Message
											</p>
										</div>
									</div>
								</li>
								<li className="px-4 py-3">
									<div className="flex items-center">
										<img
											className="w-10 h-10 rounded-full mr-4"
											src="path/to/avatar.png"
											alt="Friend Avatar"
										/>
										<div>
											<h4 className="text-lg font-bold truncate">
												Friend Name
											</h4>
											<p className="text-gray-500 max-w-sm truncate">
												Request Message
											</p>
										</div>
									</div>
								</li>
							</ul>
						</div>
						<div className="w-full mb-6 md:mb-0">
							<h3 className="text-lg font-bold mb-2 truncate">
								Game History
							</h3>
							<ul className="bg-white rounded-md shadow overflow-hidden divide-y divide-gray-200 max-h-52">
								<li className="px-4 py-3">
									<div className="flex items-center justify-between">
										<div className="flex items-center">
											<img
												className="w-10 h-10 rounded-full mr-4"
												src="path/to/avatar.png"
												alt="Opponent Avatar"
											/>
											<h4 className="text-lg font-bold truncate">
												Opponent Name
											</h4>
										</div>
										<div className="text-right">
											<p className="text-gray-500 max-w-sm truncate">
												Win/Loss
											</p>
											<p className="text-gray-500 max-w-sm truncate">
												Date Played
											</p>
										</div>
									</div>
								</li>
								<div className="flex items-center justify-between">
									<div className="flex items-center">
										<img
											className="w-10 h-10 rounded-full mr-4"
											src="path/to/avatar.png"
											alt="Opponent Avatar"
										/>
										<h4 className="text-lg font-bold truncate">
											Opponent Name
										</h4>
									</div>
									<div className="text-right">
										<p className="text-gray-500 max-w-sm truncate">
											Win/Loss
										</p>
										<p className="text-gray-500 max-w-sm truncate">
											Date Played
										</p>
									</div>
								</div>
							</ul>
						</div>{" "}
					</div>
				</div>
			</div> */}
		</div>
	);
};

export { Profile };
