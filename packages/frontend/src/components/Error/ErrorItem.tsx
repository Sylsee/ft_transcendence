import React from "react";
import { ERROR_MESSAGES } from "../../config";

interface ErrorItemProps {
	error: Error | unknown;
}

const ErrorItem: React.FC<ErrorItemProps> = ({ error }) => {
	return (
		<>
			<p className="text-red-700">
				{error instanceof Error
					? error.message
					: ERROR_MESSAGES.UNKNOWN_ERROR}
			</p>
		</>
	);
};

export { ErrorItem };
