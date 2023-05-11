export interface ButtonProps {
	name: string;
	color: string;
	handleClick: (id: string) => void;
}

export interface ButtonPropsList {
	buttons?: ButtonProps[];
}