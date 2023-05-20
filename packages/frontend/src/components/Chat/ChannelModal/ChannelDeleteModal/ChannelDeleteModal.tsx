import { ModalFooter } from "components/Modal/ModalFooter/ModalFooter";
import { useDispatch } from "react-redux";
import { setShowChannelModal } from "store/chat-slice/chat-slice";
import { Channel, ChannelModalType } from "types/chat/chat";

interface ChannelDeleteModalProps {
	handleCloseModal: () => void;
	channel: Channel;
}

const ChannelDeleteModal: React.FC<ChannelDeleteModalProps> = ({
	handleCloseModal,
	channel,
}) => {
	const dispatch = useDispatch();

	// handlers
	const handleDeleteChannel = (e: any) => {
		e.preventDefault();
		dispatch(setShowChannelModal(ChannelModalType.DeleteConfirmation));
	};

	return (
		<form onSubmit={handleDeleteChannel}>
			<div className=" text-xl">
				Do you want to delete{" "}
				<span className="font-bold">{channel.name}</span> ?
			</div>
			<ModalFooter
				acceptValue={"Delete"}
				handleCancel={handleCloseModal}
			/>
		</form>
	);
};

export { ChannelDeleteModal };
