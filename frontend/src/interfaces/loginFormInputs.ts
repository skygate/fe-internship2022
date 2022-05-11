export enum LoginInputType {
    Email,
    Password,
}

export interface LoginInputs {
    name: LoginInputType;
    id: string;
    label: string;
    placeholder: string;
    type: string,
    required: boolean,
    minlength: number,
    value: string;
}
