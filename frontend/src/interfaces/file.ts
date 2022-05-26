export interface InputFileChange {
    productImageUrl: string;
    productFromData: FormData;
}

export interface UploadFileProps {
    onImgSrcChange: (arg: InputFileChange) => void;
}

export enum FileType {
    Png,
    Gif,
    Webp,
    Mp4,
    Mp3,
    Jpg,
    Jpeg,
}

export interface FileTypeArray {
    name: FileType;
    label: string;
}

export const fileType: FileTypeArray[] = [
    { name: FileType.Png, label: "image/png" },
    { name: FileType.Gif, label: "image/gif" },
    { name: FileType.Webp, label: "image/webp" },
    { name: FileType.Mp4, label: "video/mp4" },
    { name: FileType.Mp3, label: "audio/mpeg" },
    { name: FileType.Jpg, label: "image/jpg" },
    { name: FileType.Jpeg, label: "image/jpeg" },
];

export interface UploadFileViewProps {
    active: boolean;
    onDrop: (e: React.DragEvent) => void;
    onDragEnter: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onFileInputChange: (e: React.ChangeEvent) => void;
}
