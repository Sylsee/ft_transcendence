import React from "react";
import { ERROR_MESSAGES } from "../../config";
import { ApiErrorResponse } from "../../types/global";

interface ErrorItemProps {
	error: ApiErrorResponse | null;
}

const ErrorItem: React.FC<ErrorItemProps> = ({ error }) => {
	return (
		<>
			<p className="text-red-700">
				{error !== null ? error.message : ERROR_MESSAGES.UNKNOWN_ERROR}
			</p>
		</>
	);
};

export { ErrorItem };
