import React, { useState } from "react";
import { UploadFileView } from "./uploadFileView";
import { UploadFileProps, fileType } from "../../interfaces/file";

const MAX_FILE_SIZE = 1 * 1024 * 1024 * 1024;

export const UploadFile = ({ onImgSrcChange }: UploadFileProps) => {
    const [active, setActive] = useState(false);

    const onFileSelect = (file: any) => {
        const foundItem = fileType.find((item) => item.label === file.type);

        if (!foundItem) return;

        if (file.size > MAX_FILE_SIZE) return;

        const imageForm = new FormData();
        imageForm.append("file", file);
        onImgSrcChange({ productImageUrl: URL.createObjectURL(file), productFromData: imageForm });
    };

    const onDrop = (e: React.DragEvent) => {
        onSetInactive(e);
        const file = e.dataTransfer.files[0];
        onFileSelect(file);
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

    const onFileInputChange = (e: any) => {
        const file = e.target.files[0];
        onFileSelect(file);
    };

    return (
        <UploadFileView
            active={active}
            onDrop={onDrop}
            onDragEnter={onDragEnter}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onFileInputChange={onFileInputChange}
        />
    );
};
