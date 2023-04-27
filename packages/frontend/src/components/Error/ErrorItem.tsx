import React from "react";
import { ApiErrorResponse } from "../../types/global";

interface ErrorItemProps {
	error: ApiErrorResponse | null;
}

const ErrorItem: React.FC<ErrorItemProps> = ({ error }) => {
	return (
		<>
			<p className="text-red-700">{error?.message[0]}</p>
		</>
	);
};

export { ErrorItem };
