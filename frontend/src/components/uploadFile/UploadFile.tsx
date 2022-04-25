import React, { useState } from "react";
import { UploadFileView } from "./uploadFileView";

interface UploadFileProps {
    onImgSrcChange: (arg: string) => void;
}
enum FileType {
    Png,
    Gif,
    Webp,
    Mp4,
    Mp3,
}

interface FileTypeArray {
    name: FileType;
    label: string;
}

const fileType: FileTypeArray[] = [
    { name: FileType.Png, label: "image/png" },
    { name: FileType.Gif, label: "image/gif" },
    { name: FileType.Webp, label: "image/webp" },
    { name: FileType.Mp4, label: "video/mp4" },
    { name: FileType.Mp3, label: "audio/mpeg" },
];

const MAX_FILE_SIZE = 1 * 1024 * 1024 * 1024;

export const UploadFile = ({ onImgSrcChange }: UploadFileProps) => {
    const [active, setActive] = useState(false);

    const onFileSelect = (file: any) => {
        const foundItem = fileType.find((item) => item.label === file.type);

        if (!foundItem) return;

        if (file.size > MAX_FILE_SIZE) return;

        onImgSrcChange(URL.createObjectURL(file));
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
