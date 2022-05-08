export enum LoginInputType {
    Email,
    Password,
}

export interface LoginInputs {
    name: LoginInputType;
    id: string;
    label: string;
    placeholder: string;
    value: string;
}
