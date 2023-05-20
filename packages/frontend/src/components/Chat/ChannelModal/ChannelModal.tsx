import { CreateChannelForm } from "components/Chat/ChannelModal/ChannelForm/CreateChannelForm/CreateChannelForm";
import { JoinChannelForm } from "components/Chat/ChannelModal/ChannelForm/JoinChannelForm/JoinChannelForm";
import { Modal } from "components/Modal/Modal";
import { ModalHeader } from "components/Modal/ModalHeader/ModalHeader";
import { useEffect } from "react";
import { Channel, ChannelModalType } from "types/chat/chat";
import { ChannelLeaveModal } from "./ChannelLeaveModal/ChannelLeaveModal";

interface ChannelModalProps {
	modalType: ChannelModalType;
	handleCloseModal: () => void;
	selectedChannel: Channel | null;
}

const ChannelModal: React.FC<ChannelModalProps> = ({
	modalType,
	handleCloseModal,
	selectedChannel,
}) => {
	useEffect(() => {
		if (modalType !== ChannelModalType.Create && !selectedChannel) {
			handleCloseModal();
		}
	}, [modalType, selectedChannel, handleCloseModal]);

	const title = (type: ChannelModalType) => {
		switch (type) {
			case ChannelModalType.Join:
				return "Join";
			case ChannelModalType.Create:
				return "Create";
			case ChannelModalType.Update:
				return "Update";
			case ChannelModalType.Leave:
				return "Leave";
			default:
				return "";
		}
	};

	if (modalType === ChannelModalType.None) return null;
	return (
		<Modal>
			<div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
				<ModalHeader
					title={`${title(modalType)} channel`}
					handleCancel={handleCloseModal}
					displayCancelIcon={true}
				/>
				{/*body*/}
				<div className="relative p-6 flex-auto justify-center">
					{(modalType === ChannelModalType.Create ||
						modalType === ChannelModalType.Update) && (
						<CreateChannelForm
							handleCloseModal={handleCloseModal}
							channel={selectedChannel}
							formType={modalType}
						/>
					)}
					{modalType === ChannelModalType.Join && selectedChannel && (
						<JoinChannelForm
							handleCloseModal={handleCloseModal}
							channel={selectedChannel}
						/>
					)}
					{modalType === ChannelModalType.Leave &&
						selectedChannel && (
							<ChannelLeaveModal
								handleCloseModal={handleCloseModal}
								channel={selectedChannel}
							/>
						)}
				</div>
			</div>
		</Modal>
	);
};

export { ChannelModal };
