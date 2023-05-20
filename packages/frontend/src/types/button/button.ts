export interface ButtonProps {
	name: string;
	color: string;
	handleClick: (id: string) => void;
}

export interface ButtonPropsList {
	buttons?: ButtonProps[];
}

export enum ModalButtonType {
	Accept = "accept",
	Critical = "critical",
	Cancel = "cancel",
}
