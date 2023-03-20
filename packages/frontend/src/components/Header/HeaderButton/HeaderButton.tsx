interface HeaderButtonProps {
	name: string;
	onClick?: () => void;
}

const HeaderButton: React.FC<HeaderButtonProps> = ({ name, onClick }) => {
	return (
		<li className="nav-item">
			<button
				onClick={onClick}
				className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
			>
				<i className="fab fa-pinterest text-lg leading-lg text-white opacity-75"></i>
				<span className="ml-2">{name}</span>
			</button>
		</li>
	);
};

export { HeaderButton };
