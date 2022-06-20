import style from "./uploadFile.module.scss";
import icon from "assets/uploadIcon.svg";
import { UploadFileViewProps } from "interfaces/file";

export const UploadFileView = ({
    active,
    onDrop,
    onDragEnter,
    onDragOver,
    onDragLeave,
    onFileInputChange,
}: UploadFileViewProps) => {
    return (
        <div className={style.uploadContainer}>
            <p className={style.title}>Upload file</p>
            <p className={style.info}>Drag or choose your file upload</p>
            <label
                htmlFor="fileInput"
                className={active ? `${style.dropArea} ${style.active}` : `${style.dropArea}`}
                onDrop={onDrop}
                onDragEnter={onDragEnter}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
            >
                <input
                    type="file"
                    className={style.fileInput}
                    id="fileInput"
                    accept=".png, .webp, .gif, .jpg, .jpeg"
                    onChange={onFileInputChange}
                />

                <img src={icon} alt="upload icon" />
                <p>PNG, JPG, JPEG, GIF, WEBP. Max 1 Gb.</p>
            </label>
        </div>
    );
};
