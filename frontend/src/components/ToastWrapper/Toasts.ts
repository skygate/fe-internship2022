import { Id, toast, TypeOptions } from "react-toastify";

export const ErrorToast = (message: string) => {
    toast.error(message, {
        type: "error",
        isLoading: false,
        autoClose: 2500,
        closeOnClick: true,
    });
};
export const LoadingToast = (message: string) => {
    return toast.loading(message);
};

export const UpdateToast = (id: Id, message: string, type: TypeOptions) => {
    return toast.update(id, {
        render: message,
        type: type,
        isLoading: false,
        autoClose: 2500,
        closeOnClick: true,
    });
};
