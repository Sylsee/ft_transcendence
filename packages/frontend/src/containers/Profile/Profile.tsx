import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { ErrorNotFound } from "../../components/Error/ErrorNotFound";
import { Loader } from "../../components/Loader/Loader";
import { FriendsCard } from "../../components/Profile/FriendsCard/FriendsCard";
import { ProfileCard } from "../../components/Profile/ProfileCard/ProfileCard";
import { useFetchUser } from "../../hooks/user/useFetchUser";
import { RootState } from "../../types/global";

const Profile = () => {
	const { id } = useParams<{ id: string }>();
	const location = useLocation();

	// TODO 404 first render

	const connected_user = useSelector((store: RootState) => store.USER.user);
	const [isConnectedUser, setIsConnectedUser] = useState<boolean>(
		connected_user !== null && connected_user.id === id
	);

	useEffect(() => {
		setIsConnectedUser(connected_user !== null && connected_user.id === id);
	}, [connected_user, id]);

	useEffect(() => {}, [id, location]);

	const {
		data: userData,
		error,
		isError,
		isLoading,
	} = useFetchUser(id, isConnectedUser);

	if (!connected_user) return <Loader />;

	if (!id || !userData) return <ErrorNotFound />;

	return (
		<div className="flex justify-center text-white mt-10 px-4">
			<div className="flex flex-col lg:flex-row w-full max-w-7xl">
				<ProfileCard
					id={id}
					connected_user={connected_user}
					isConnectedUser={isConnectedUser}
				/>
				<div className="flex flex-col lg:w-1/2 w-full mt-7 lg:mt-0 lg:ml-4 ">
					<FriendsCard
						id={id}
						connected_user={connected_user}
						isConnectedUser={isConnectedUser}
					/>
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
