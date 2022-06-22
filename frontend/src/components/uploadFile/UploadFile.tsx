import React, { useContext, useState } from "react";
import { UploadFileView } from "./uploadFileView";
import { UploadFileProps, fileType } from "interfaces/file";
import { FormContext } from "views";

const MAX_FILE_SIZE = 1 * 1024 * 1024 * 1024;

export const UploadFile = ({ onImgSrcChange }: UploadFileProps) => {
    const [active, setActive] = useState(false);
    const formState = useContext(FormContext);

    const onFileSelect = (file: File, value: string) => {
        const foundItem = fileType.find((item) => item.label === file.type);

        if (!foundItem) return;

        if (file.size > MAX_FILE_SIZE) return;

        const imageForm = new FormData();
        imageForm.append("file", file);
        onImgSrcChange({
            productImageUrl: URL.createObjectURL(file),
            productFromData: imageForm,
            inputValue: value,
        });
    };

    const onDrop = (e: React.DragEvent) => {
        onSetInactive(e);
        const file = e.dataTransfer.files[0];
        const target = e.target as HTMLInputElement;
        const value = target.value;
        onFileSelect(file, value);
    };

    const onSetActive = (e: React.DragEvent) => {
        e.preventDefault();
        setActive(true);
    };

    const onSetInactive = (e: React.DragEvent) => {
        e.preventDefault();
        setActive(false);
    };

    const onDragEnter = (e: React.DragEvent) => onSetActive(e);
    const onDragOver = (e: React.DragEvent) => onSetActive(e);
    const onDragLeave = (e: React.DragEvent) => onSetInactive(e);

    const onFileInputChange = (e: React.ChangeEvent) => {
        const target = e.target as HTMLInputElement;
        if (!target.files) return;
        const file = target.files[0];
        const value = target.value;
        onFileSelect(file, value);
    };

    return (
        <UploadFileView
            active={active}
            onDrop={onDrop}
            onDragEnter={onDragEnter}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onFileInputChange={onFileInputChange}
            value={formState.fileInputValue}
        />
    );
};
