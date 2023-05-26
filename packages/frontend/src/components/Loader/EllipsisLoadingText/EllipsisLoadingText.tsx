import styles from "components/Lobby/Lobby.module.css";
import React from "react";

interface EllipsisLoadingTextProps {
	content: string;
}

const EllipsisLoadingText: React.FC<EllipsisLoadingTextProps> = ({
	content,
}) => {
	return (
		<div className={`${styles.loading}`}>
			{content}
			<span className={`${styles.dotsContainer} text-left`}></span>
		</div>
	);
};

export { EllipsisLoadingText };
