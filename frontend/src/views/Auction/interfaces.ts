export enum ToolsOptions {
    EditAuction = "editAuction",
    DeleteAuction = "deleteAuction",
    Report = "report",
}

export interface ToolsItem {
    action: ToolsOptions;
    label: string;
    icon: JSX.Element;
    onClick: (modalID: string) => void;
    visible: string;
}

export interface ModalsVisibilityState {
    placeBid: boolean;
    purchase: boolean;
    editAuction: boolean;
    deleteAuction: boolean;
}
