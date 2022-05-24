import { ReactNode, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.scss";
import ExitIcon from "../../assets/ExitIcon.svg";

export interface ModalProps {
    title?: string;
    description?: string;
    children?: ReactNode;
    visible: boolean;
    onClose: () => void;
    outerClassName?: string;
    containerClassName?: string;
}

const Modal = ({ title, visible, onClose, children, description = "" }: ModalProps) => {
    const escFunction = useCallback(
        (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        },
        [onClose]
    );

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [escFunction]);

    return createPortal(
        visible && (
            <div className={styles.wrapper} onClick={onClose}>
                <div className={styles.container} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.modal_header}>
                        <div className={styles.modal_header_top_wrapper}>
                            <div className={styles.modal_text}>{title}</div>
                            <img src={ExitIcon} className={styles.exitIcon} onClick={onClose} />
                        </div>
                        {description && (
                            <div className={styles.modal_description}>{description}</div>
                        )}
                    </div>
                    {children}
                </div>
            </div>
        ),
        document.body
    );
};

export default Modal;
