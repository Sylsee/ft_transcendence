import { ErrorItem } from "components/Error/ErrorItem";
import { ModalFooter } from "components/Modal/ModalFooter/ModalFooter";
import { useDeleteChannel } from "hooks/chat/useDeleteChannel";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setShowChannelModal } from "store/chat-slice/chat-slice";
import { Channel, ChannelModalType, ChannelType } from "types/chat/chat";

interface ChannelDeleteConfirmationModalProps {
	handleCloseModal: () => void;
	channel: Channel;
}

const ChannelDeleteConfirmationModal: React.FC<
	ChannelDeleteConfirmationModalProps
> = ({ handleCloseModal, channel }) => {
	// redux
	const dispatch = useDispatch();

	// mutations
	const { status, error, mutate } = useDeleteChannel();

	// hooks
	useEffect(() => {
		if (status === "success") {
			handleCloseModal();
		}
	}, [status, handleCloseModal]);

	// handlers
	const handleDeleteChannel = (e: any) => {
		e.preventDefault();
		mutate(channel.id);
	};

	const handleCancelDeleteChannel = () => {
		if (channel.type === ChannelType.Direct_message) {
			dispatch(setShowChannelModal(ChannelModalType.Delete));
		} else {
			dispatch(setShowChannelModal(ChannelModalType.Update));
		}
	};

	return (
		<form onSubmit={handleDeleteChannel}>
			<div className=" text-xl">
				Are you sure you want to permanently delete the channel{" "}
				<span className="font-bold">{channel.name}</span> ? This action
				cannot be undone, and all associated messages will be lost.
			</div>
			{status === "error" && <ErrorItem error={error} />}
			<ModalFooter
				acceptValue={"Delete"}
				handleCancel={handleCancelDeleteChannel}
			/>
		</form>
	);
};

export { ChannelDeleteConfirmationModal };
