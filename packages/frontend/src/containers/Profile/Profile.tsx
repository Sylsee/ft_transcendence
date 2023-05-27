import { ErrorNotFound } from "components/Error/ErrorNotFound";
import { Loader } from "components/Loader/Loader";
import { MatchHistoryCard } from "components/Profile/MatchHistoryCard/MatchHistoryCard";
import { ProfileCard } from "components/Profile/ProfileCard/ProfileCard";
import { UserRelationCard } from "components/Profile/UserRelationCard/UserRelationCard";
import { UserStatCard } from "components/Profile/UserStatsCard/UserStatsCard";
import { useFetchUser } from "hooks/user/useFetchUser";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { RootState } from "types/global/global";

const Profile = () => {
	// react-router
	const { id } = useParams<{ id: string }>();
	const location = useLocation();

	// redux
	const connectedUser = useSelector((store: RootState) => store.USER.user);

	// state
	const [isConnectedUser, setIsConnectedUser] = useState<boolean>(
		connectedUser !== null && connectedUser.id === id
	);

	// custom hooks
	const {
		data: userData,
		refetch: refetchUser,
		status,
	} = useFetchUser(id, isConnectedUser);

	// hooks
	useEffect(() => {
		setIsConnectedUser(connectedUser !== null && connectedUser.id === id);
	}, [connectedUser, id]);

	useEffect(() => {
		if (id) refetchUser();
	}, [id, location, refetchUser]);

	if (status === "loading" || !id || !connectedUser) return <Loader />;

	if (status === "error" || (status === "success" && !userData))
		return <ErrorNotFound />;

	return (
		<div className="flex flex-col items-center w-full h-full text-white p-4 overflow-auto">
			<div className="w-full max-w-7xl mt-10">
				<div className="flex flex-col lg:flex-row">
					<ProfileCard
						user={isConnectedUser ? connectedUser : userData}
						isConnectedUser={isConnectedUser}
					/>
					<div className="flex flex-col lg:w-1/2 w-full mt-4 lg:mt-0 lg:ml-4">
						<UserRelationCard
							id={id}
							isConnectedUser={isConnectedUser}
						/>
					</div>
				</div>
				<div className="w-full flex flex-col lg:flex-row">
					<UserStatCard id={id} />
					<MatchHistoryCard id={id} userId={id} />
				</div>
			</div>
		</div>
	);
};

export { Profile };
