import React from "react";

interface ErrorNotFoundProps {
	message?: string;
}

const ErrorNotFound: React.FC<ErrorNotFoundProps> = ({
	message = "404 not found.",
}) => {
	return (
		<>
			<div className="">
				<div>
					<h1 className="text-4xl font-bold text-gray-900">
						{message}
					</h1>
				</div>
			</div>
		</>
	);
};

export { ErrorNotFound };
