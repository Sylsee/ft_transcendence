import { ErrorItem } from "components/Error/ErrorItem";
import { Loader } from "components/Loader/Loader";
import { useGenerateTwoFa } from "hooks/auth/useGenerateTwoFa";
import { useEffect } from "react";

interface TwoFaQrCodeProps {}

const TwoFaQrCode: React.FC<TwoFaQrCodeProps> = () => {
	const { data, mutate, status, error } = useGenerateTwoFa();

	useEffect(() => {
		mutate();
	}, [mutate]);

	return (
		<div className="flex justify-center">
			{status === "success" ? (
				<div className="flex flex-col justify-center items-center">
					<div className="">
						<img
							className="aspect-square"
							src={data.qrCode}
							alt="2fa QR Code"
						/>
					</div>
					<div className="w-full">
						<p className="break-words text-center">
							{data.manualEntryKey}
						</p>
					</div>
				</div>
			) : status === "loading" ? (
				<Loader color="gray" />
			) : (
				<ErrorItem error={error} />
			)}
		</div>
	);
};

export { TwoFaQrCode };
