import { TailSpin } from "react-loader-spinner";

interface LoaderProps {
	color?: string;
}

const Loader: React.FC<LoaderProps> = ({ color = "white" }) => {
	return (
		<div className="h-full flex flex-col   items-center justify-center">
			<TailSpin
				height="80"
				width="80"
				color={color}
				ariaLabel="tail-spin-loading"
				radius="1"
				wrapperStyle={{}}
				wrapperClass=""
				visible={true}
			/>
		</div>
	);
};

export { Loader };
