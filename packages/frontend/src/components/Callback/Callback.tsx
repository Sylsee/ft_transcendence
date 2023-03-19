import { useEffect, useState } from "react";
import { Loader } from "../Loader/Loader";

const Callback: React.FC = () => {
	const [loading, setLoading] = useState(true);

	useEffect(() => {}, []);

	if (loading)
		return (
			<>
				<Loader />
			</>
		);
	return <></>;
};

export { Callback };
