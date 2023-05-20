import { ErrorItem } from "components/Error/ErrorItem";
import { ModalFooter } from "components/Modal/ModalFooter/ModalFooter";
import { UserRowButton } from "components/Profile/UserRelationCard/UserList/UserRow/Buttons/UserRowButton";
import { useCreateChannel } from "hooks/chat/useCreateChannel";
import { useUpdateChannel } from "hooks/chat/useUpdateChannel";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
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

			<div className="flex justify-between">
				{/* <div className="flex items-center">
					<UserRowButton
						color={"tamarillo"}
						name="Delete"
						handleClick={() => {
							alert("FDP");
						}}
					/>
				</div> */}
				<div className="flex items-center justify-end p-6 border-solid border-slate-200 rounded-b">
					<UserRowButton
						color={"tamarillo"}
						name="Delete"
						handleClick={() => {
							alert("FDP");
						}}
					/>

					<button
						className="bg-tamarillo-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
						type="submit"
					>
						Delete
					</button>
				</div>
				<ModalFooter
					acceptValue={isUpdate ? "Update" : "Create"}
					handleCancel={handleCloseModal}
				/>
			</div>
		</form>
	);
};

export { CreateChannelForm };
