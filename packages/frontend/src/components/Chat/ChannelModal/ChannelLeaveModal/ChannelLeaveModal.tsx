import { ErrorItem } from "components/Error/ErrorItem";
import { ModalFooter } from "components/Modal/ModalFooter/ModalFooter";
import { useLeaveChannel } from "hooks/chat/useLeaveChannel";
import { useEffect } from "react";
import { Channel } from "types/chat/chat";

interface ChannelLeaveModalProps {
	handleCloseModal: () => void;
	channel: Channel;
}

const ChannelLeaveModal: React.FC<ChannelLeaveModalProps> = ({
	handleCloseModal,
	channel,
}) => {
	const { status, error, mutate } = useLeaveChannel();

	useEffect(() => {
		if (status === "success") {
			handleCloseModal();
		}
	}, [status, handleCloseModal]);

	const handleLeaveChannel = () => {
		mutate(channel.id);
	};

	return (
		<form onSubmit={handleLeaveChannel}>
			<div className=" text-xl">
				Do you want to leave{" "}
				<span className="font-bold">{channel.name}</span> ?
			</div>
			{status === "error" && <ErrorItem error={error} />}
			<ModalFooter
				acceptValue={"Leave"}
				handleCancel={handleCloseModal}
			/>
		</form>
	);
};

export { ChannelLeaveModal };
