interface IconButtonProps {
	name: string;
	onClick?: (url: string) => void;
	url: string;
	logo: JSX.Element;
}

const IconButton: React.FC<IconButtonProps> = ({
	name,
	onClick = () => {},
	url,
	logo,
}) => {
	return (
		<button
			onClick={(e) => onClick(url)}
			className="mx-3 p-2 rounded-lg bg-astronaut-950 border-2 font-bold border-mirage-950 flex items-center gap-3 opacity-70 hover:opacity-100"
		>
			<div className="h-7 w-7">{logo}</div>
			<p className="text-white">{name}</p>
		</button>
	);
};

export { IconButton };
