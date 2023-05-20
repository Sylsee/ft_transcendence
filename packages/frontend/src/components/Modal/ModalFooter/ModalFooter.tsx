import { ModalButtonType } from "types/button/button";
import { ModalButton } from "../ModalButton/ModalButton";

interface ModalFooterProps {
	cancelValue?: string;
	handleCancel: () => void;
	acceptValue?: string;
}

const ModalFooter: React.FC<ModalFooterProps> = ({
	cancelValue = "Cancel",
	handleCancel,
	acceptValue = "Accept",
}) => {
	return (
		<div className="flex items-center justify-end p-6 rounded-b">
			<ModalButton
				name={cancelValue}
				type="button"
				buttonType={ModalButtonType.Cancel}
				handleClick={() => handleCancel()}
			/>
			<ModalButton
				name={acceptValue}
				type="submit"
				buttonType={ModalButtonType.Accept}
			/>
		</div>
	);
};

export { ModalFooter };
