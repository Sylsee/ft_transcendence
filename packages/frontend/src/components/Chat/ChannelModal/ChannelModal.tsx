import React, { useEffect } from "react";
import { Channel, ChannelModalType } from "../../../types/chat";
import { Modal } from "../../Modal/Modal";
import { ModalHeader } from "../../Modal/ModalHeader/ModalHeader";
import { CreateChannelForm } from "./ChannelForm/CreateChannelForm/CreateChannelForm";
import { JoinChannelForm } from "./ChannelForm/JoinChannelForm/JoinChannelForm";

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

	if (modalType === ChannelModalType.None) return null;
	return (
		<Modal>
			<div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
				<ModalHeader
					title={`${
						modalType === ChannelModalType.Join
							? `Join ${selectedChannel?.name}`
							: modalType === ChannelModalType.Create
							? "Create"
							: "Update"
					} channel`}
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
				</div>
			</div>
		</Modal>
	);
};

export { ChannelModal };
