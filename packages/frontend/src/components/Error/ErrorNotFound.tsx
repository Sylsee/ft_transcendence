interface ErrorNotFoundProps {
	message?: string;
}

const ErrorNotFound: React.FC<ErrorNotFoundProps> = ({
	message = "404 not found.",
}) => {
	return (
		<div className="h-full flex justify-center">
			<div className="flex flex-col items-center justify-center  px-4">
				<p className=" text-7xl text-center font-bold mb-6  ">
					{message}
				</p>
				<img
					className="aspect-square mt-24"
					src="https://risibank.fr/cache/medias/0/3/361/36156/full.png"
					alt="404 not found"
				/>
			</div>
		</div>
	);
};

export { ErrorNotFound };
