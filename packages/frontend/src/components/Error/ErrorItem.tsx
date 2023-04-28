import { ApiErrorResponse } from "types/global/global";

interface ErrorItemProps {
	error: ApiErrorResponse | null;
}

const ErrorItem: React.FC<ErrorItemProps> = ({ error }) => {
	if (!error) return null;

	return (
		<>
			<p className="text-red-700">
				{Array.isArray(error.message)
					? error.message[0]
					: error.message}
			</p>
		</>
	);
};

export { ErrorItem };
