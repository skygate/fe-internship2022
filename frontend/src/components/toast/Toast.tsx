import style from "./toast.module.scss";

interface ToastProps {
    message: string;
}

export const Toast = ({ message }: ToastProps) => {
    return <div className={style.toast}>{message}</div>;
};
