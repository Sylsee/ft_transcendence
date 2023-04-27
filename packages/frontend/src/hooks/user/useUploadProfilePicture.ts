import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { uploadProfilePicture } from "../../api/user/userRequests";
import { ApiErrorResponse } from "../../types/global";

const useUploadProfilePicture = (): UseMutationResult<
	void,
	ApiErrorResponse,
	File
> => {
	const mutation = useMutation<void, ApiErrorResponse, File>(
		(profilePicture: File) => uploadProfilePicture(profilePicture)
	);
	return mutation;
};

export { useUploadProfilePicture };
