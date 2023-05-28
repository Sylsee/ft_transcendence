import { ErrorItem } from "components/Error/ErrorItem";
import { ModalButton } from "components/Modal/ModalButton/ModalButton";
import { ModalFooter } from "components/Modal/ModalFooter/ModalFooter";
import { useCreateChannel } from "hooks/chat/useCreateChannel";
import { useUpdateChannel } from "hooks/chat/useUpdateChannel";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setShowChannelModal } from "store/chat-slice/chat-slice";
import { ModalButtonType } from "types/button/button";
import { Channel, ChannelModalType, ChannelType } from "types/chat/chat";

interface CreateChannelFormProps {
	handleCloseModal: () => void;
	channel: Channel | null;
	formType: ChannelModalType;
}

const CreateChannelForm: React.FC<CreateChannelFormProps> = ({
	handleCloseModal,
	formType,
	channel,
}) => {
	const isUpdate = !!channel && formType === ChannelModalType.Update;

	// redux
	const dispatch = useDispatch();

	// mutations
	const updateMutation = useUpdateChannel(channel?.id);
	const createMutation = useCreateChannel();

	const { mutate, status, error } = isUpdate
		? updateMutation
		: createMutation;

	// useForm hook
	const { register, handleSubmit, watch, setValue, setFocus } = useForm({
		defaultValues: {
			name: isUpdate ? channel.name : "",
			type: isUpdate ? channel.type : ChannelType.Public,
			password: "",
		},
	});

	// watch hook
	const type = watch("type");

	// hooks
	useEffect(() => {
		if (type === ChannelType.Password_protected) setFocus("password");
		else setFocus("name");
	}, [type, setFocus]);

	useEffect(() => {
		if (status === "success") {
			handleCloseModal();
		}
	}, [status, handleCloseModal]);

	useEffect(() => {
		if (isUpdate && !channel) handleCloseModal();
	}, [isUpdate, channel, handleCloseModal]);

	// handlers
	const onCreateFormSubmit = (data: any) => {
		if (data.type === "public" || data.password === "")
			delete data.password;
		mutate(data);
	};

	const onUpdateFormSubmit = (data: any) => {
		if (!channel) return;
		if (data.type === "public" || data.password === "")
			delete data.password;
		if (data.name === channel.name) delete data.name;
		if (data.type === channel.type) delete data.type;
		if (Object.keys(data).length > 0) mutate(data);
	};

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue("name", e.target.value.replace(/ /g, "_"));
	};

	const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setValue("password", "");
		if (e.target.value === "public") setValue("type", ChannelType.Public);
		else if (e.target.value === ChannelType.Password_protected)
			setValue("type", ChannelType.Password_protected);
		else if (e.target.value === ChannelType.Private)
			setValue("type", ChannelType.Private);
	};

	const handleDeleteClick = () => {
		if (!channel) return;

		dispatch(setShowChannelModal(ChannelModalType.DeleteConfirmation));
	};

	const onFormSubmit = isUpdate ? onUpdateFormSubmit : onCreateFormSubmit;

	return (
		<form onSubmit={handleSubmit(onFormSubmit)}>
			<div className="flex flex-col mt-4">
				<label
					htmlFor="name"
					className="mb-2 text-xs font-bold text-gray-600"
				>
					Name:
				</label>
				<input
					id="name"
					className="border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
					{...register("name")}
					onChange={(e) => handleNameChange(e)}
				/>
			</div>
			<div className="flex flex-col mt-4">
				<label
					htmlFor="type"
					className="mb-2 text-xs font-bold text-gray-600"
				>
					Channel type:
				</label>
				<select
					className="cursor-pointer block p-3 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
					id="type"
					{...register("type")}
					onChange={(e) => handleTypeChange(e)}
				>
					<option value={ChannelType.Public}>Public</option>
					<option value={ChannelType.Password_protected}>
						Password protected
					</option>
					<option value={ChannelType.Private}>Private</option>
				</select>
			</div>
			{type === ChannelType.Password_protected && (
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

			<ModalFooter
				acceptValue={isUpdate ? "Update" : "Create"}
				handleCancel={handleCloseModal}
			>
				{isUpdate && channel.permissions.canDelete && (
					<ModalButton
						name="Delete"
						buttonType={ModalButtonType.Critical}
						handleClick={handleDeleteClick}
					/>
				)}
			</ModalFooter>
		</form>
	);
};

export { CreateChannelForm };
