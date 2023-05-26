import { ErrorNotFound } from "components/Error/ErrorNotFound";
import { Loader } from "components/Loader/Loader";
import { ProfileCard } from "components/Profile/ProfileCard/ProfileCard";
import { UserRelationCard } from "components/Profile/UserRelationCard/UserRelationCard";
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
	const connected_user = useSelector((store: RootState) => store.USER.user);

	// state
	const [isConnectedUser, setIsConnectedUser] = useState<boolean>(
		connected_user !== null && connected_user.id === id
	);

	// custom hooks
	const {
		data: userData,
		refetch: refetchUser,
		status,
	} = useFetchUser(id, isConnectedUser);

	// hooks
	useEffect(() => {
		setIsConnectedUser(connected_user !== null && connected_user.id === id);
	}, [connected_user, id]);

	useEffect(() => {
		if (id) refetchUser();
	}, [id, location, refetchUser]);

	if (status === "loading" || !id || !connected_user) return <Loader />;

	if (status === "error" || (status === "success" && !userData))
		return <ErrorNotFound />;

	return (
		<div className="flex justify-center text-white px-4">
			<div className="flex flex-col xl:flex-row  w-full max-w-6xl">
				<div className="flex flex-col w-full">
					<ProfileCard
						user={isConnectedUser ? connected_user : userData}
						isConnectedUser={isConnectedUser}
					/>
					{/* ProfileStats */}
					<div className="w-full h-64"></div>
				</div>
				<div className="flex flex-col w-full mt-7 lg:mt-0 lg:ml-4">
					<UserRelationCard
						id={id}
						isConnectedUser={isConnectedUser}
					/>
				</div>
			</div>
		</div>
	);
};

export { Profile };
