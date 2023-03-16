import React from "react";
import { Link } from "react-router-dom";

interface HeaderLinkProps {
	name: string;
	link: string;
}

const HeaderLink: React.FC<HeaderLinkProps> = ({ name, link }) => {
	return (
		<li className="nav-item">
			<Link
				className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
				to={link}
			>
				<i className="fab fa-pinterest text-lg leading-lg text-white opacity-75"></i>
				<span className="ml-2">{name}</span>
			</Link>
		</li>
	);
};

export { HeaderLink };
