interface ErrorNotFoundProps {
	message?: string;
}

const ErrorNotFound: React.FC<ErrorNotFoundProps> = ({
	message = "404 not found.",
}) => {
	return (
		<div className="h-full flex justify-center w-full">
			<div className="flex flex-col items-center justify-center  px-4">
				<p className=" text-7xl text-center font-bold mb-6  ">
					{message}
				</p>
			</div>
		</div>
	);
};

export { ErrorNotFound };
