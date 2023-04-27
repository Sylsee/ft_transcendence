import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useJoinChannel } from "../../../../../hooks/chat/useJoinChannel";
import { Channel, ChannelType } from "../../../../../types/chat";
import { ErrorItem } from "../../../../Error/ErrorItem";
import { ModalFooter } from "../../../../Modal/ModalFooter/ModalFooter";

interface JoinChannelFormProps {
	handleCloseModal: () => void;
	channel: Channel;
}

const JoinChannelForm: React.FC<JoinChannelFormProps> = ({
	handleCloseModal,
	channel,
}) => {
	// mutations
	const { mutate, status, error } = useJoinChannel();

	// useForm hook
	const { register, handleSubmit, setFocus } = useForm({
		defaultValues: {
			password: "",
		},
	});

	// hooks
	useEffect(() => {
		if (status === "success") {
			handleCloseModal();
		}
	}, [status, handleCloseModal]);

	useEffect(() => {
		setFocus("password");
	}, [setFocus]);

	useEffect(() => {
		if (!channel) {
			handleCloseModal();
		}
	}, [channel, handleCloseModal]);

	// handlers
	const onFormSubmit = (data: any) => {
		if (data.password === "") delete data.password;
		mutate({ id: channel.id, data });
	};

	return (
		<form onSubmit={handleSubmit(onFormSubmit)}>
			{channel.type === ChannelType.Password_protected && (
				<div className="flex flex-col mt-4">
					<label
						htmlFor="password"
						className="mb-2 text-xs font-bold text-gray-600"
					>
						Password:
					</label>
					<input
						id="password"
						type="password"
						className="border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
						{...register("password")}
					/>
				</div>
			)}
			{status === "error" && <ErrorItem error={error} />}
			<ModalFooter acceptValue={"Join"} handleCancel={handleCloseModal} />
		</form>
	);
};

export { JoinChannelForm };
