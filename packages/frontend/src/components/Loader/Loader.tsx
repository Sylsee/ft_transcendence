import { LineWave, TailSpin } from "react-loader-spinner";
import { LoaderType } from "types/loader/loader";

interface LoaderProps {
	color?: string;
	type?: LoaderType;
	width?: number;
	height?: number;
}

const Loader: React.FC<LoaderProps> = ({
	color = "white",
	type = LoaderType.TailSpine,
	width = 80,
	height = 80,
}) => {
	return (
		<div className="h-full w-full flex flex-col  items-center justify-center">
			<div className="flex justify-center items-center">
				{type === LoaderType.TailSpine ? (
					<TailSpin
						height={height}
						width={width}
						color={color}
						ariaLabel="tail-spin-loading"
						radius="1"
						wrapperStyle={{}}
						wrapperClass=""
						visible={true}
					/>
				) : (
					<LineWave
						height={height}
						width={width}
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
