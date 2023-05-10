import { UserRowButton } from "components/Profile/UserRelationCard/UserList/UserRow/Buttons/UserRowButton";
import React from "react";
import styles from "./Lobby.module.css";

interface LobbyProps {}

const Lobby: React.FC<LobbyProps> = ({}) => {
	const [isWaiting, setIsWaiting] = React.useState(false);

	return (
		<div className="h-full flex justify-center items-stretch">
			{!isWaiting && (
				<div className="w-full max-w-4xl flex flex-col justify-center  ">
					<div className="mb-4">
						<div className="text-xl font-bold text-center">
							<h1>
								Step into the Pong arena and challenge players
								from around the globe!
							</h1>
						</div>
					</div>
					<div className="flex flex-col md:flex-row text-lg">
						<div className="flex justify-center items-center h-64 w-full">
							<UserRowButton
								color="silver-tree"
								name="Create a lobby"
								handleClick={() => {
									setIsWaiting(!isWaiting);
								}}
							/>
						</div>
						<div className="w-full flex justify-center">
							<div className="w-full md:w-1 max-w-[80%] h-1 md:h-full bg-mirage-950"></div>
						</div>
						<div className="flex justify-center items-center h-64 w-full ">
							<UserRowButton
								color="astronaut"
								name="Join queue"
								handleClick={() => {
									setIsWaiting(!isWaiting);
								}}
							/>
						</div>
					</div>
				</div>
			)}

			{isWaiting && (
				<div className="flex flex-col justify-center  ">
					<div className="">
						<div className="text-xl font-bold text-center mb-4">
							<div className={`${styles.loading}`}>
								Waiting for a match
								<span
									className={`${styles.dotsContainer} text-left`}
								></span>
							</div>
						</div>
						<div className="w-full flex justify-center">
							<div className="w-full md:w-1 max-w-[80%] h-1 md:h-full bg-mirage-950"></div>
						</div>
						<div className="flex justify-center items-center w-full text-lg">
							<UserRowButton
								color="astronaut"
								name="Cancel"
								handleClick={() => {
									setIsWaiting(!isWaiting);
								}}
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export { Lobby };
