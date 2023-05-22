import { ModalButtonType } from "types/button/button";
import { ModalButton } from "../ModalButton/ModalButton";

interface ModalFooterProps {
	cancelValue?: string;
	handleCancel: () => void;
	acceptValue?: string;
	children?: React.ReactNode;
}

const ModalFooter: React.FC<ModalFooterProps> = ({
	cancelValue = "Cancel",
	handleCancel,
	acceptValue = "Accept",
	children,
}) => {
	return (
		<div className="flex justify-between pt-4 flex-wrap">
			<div>{children}</div>
			<div className="flex items-center justify-end">
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
		</div>
	);
};

export { ModalFooter };
