import { LineWave, TailSpin } from "react-loader-spinner";
import { LoaderType } from "types/loader";

interface LoaderProps {
	color?: string;
	type?: LoaderType;
}

const Loader: React.FC<LoaderProps> = ({
	color = "white",
	type = LoaderType.TailSpine,
}) => {
	return (
		<div className="h-full flex flex-col  items-center justify-center">
			<div className="flex justify-center items-center">
				{type === LoaderType.TailSpine ? (
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
				) : (
					<LineWave
						height="50"
						width="50"
						color={color}
						ariaLabel="line-wave"
						wrapperStyle={{}}
						wrapperClass=""
						visible={true}
						firstLineColor=""
						middleLineColor=""
						lastLineColor=""
					/>
				)}
			</div>
		</div>
	);
};

export { Loader };
