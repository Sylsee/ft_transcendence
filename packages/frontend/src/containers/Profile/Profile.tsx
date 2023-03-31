import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Friends } from "../../components/Profile/Friends/Friends";
import { ProfileCard } from "../../components/Profile/ProfileCard/ProfileCard";

const Profile = () => {
	const { id } = useParams<{ id: string }>();
	const location = useLocation();
	useEffect(() => {}, [id, location]);

	return (
		<div className="flex justify-center text-white mt-10 px-4">
			<div className="flex flex-col lg:flex-row w-full max-w-7xl">
				<ProfileCard id={id} />
				<div className="flex flex-col lg:w-1/2 w-full mt-7 lg:mt-0 lg:ml-4 ">
					<Friends title="Friends Requests" isFriends={false} />
					<Friends title="Friends" isFriends={true} />
					<div className="flex bg-blue-gray-400 w-full">
						<div className="flex flex-col">
							<p>Stats</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export { Profile };
