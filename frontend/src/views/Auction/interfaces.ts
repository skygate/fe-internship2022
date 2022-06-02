export enum ToolsOptions {
    EditAuction = "editAuction",
    RemoveFromSale = "removeFromSale",
    Report = "report",
}

export interface ToolsItem {
    action: ToolsOptions;
    icon: JSX.Element;
}

export interface ModalsVisibilityState {
    placeBid: boolean;
    purchase: boolean;
}
