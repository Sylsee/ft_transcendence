interface IconButtonProps {
	name: string;
	onClick?: () => void;
	logo: JSX.Element;
}

const IconButton: React.FC<IconButtonProps> = ({ name, onClick, logo }) => {
	return (
		<button
			onClick={onClick}
			className="p-2 rounded-lg border-2 border-black  flex items-center gap-3 opacity-70 hover:opacity-100"
		>
			<div className="h-7 w-7">{logo}</div>
			<p className="text-white">{name}</p>
		</button>
	);
};

export { IconButton };
