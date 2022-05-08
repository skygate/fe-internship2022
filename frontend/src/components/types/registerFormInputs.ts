export enum RegisterInputType {
    Email,
    Username,
    Password,
}

export interface RegisterInputs {
    name: RegisterInputType;
    id: string;
    label: string;
    placeholder: string;
    value: string;
}
