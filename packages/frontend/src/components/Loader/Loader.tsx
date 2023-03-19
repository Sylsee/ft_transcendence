import { TailSpin } from "react-loader-spinner";

const Loader: React.FC = () => {
	return (
		<div className="h-full flex flex-col   items-center justify-center">
			<TailSpin
				height="80"
				width="80"
				color="#4fa94d"
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
