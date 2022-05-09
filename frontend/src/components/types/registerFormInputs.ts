import React from "react";

export enum RegisterInputType {
    Email,
    Username,
    Password,
    ConfirmPassword
}

export interface RegisterInputs {
    name: RegisterInputType;
    id: string;
    label: string;
    placeholder: string;
    type: string;
    required: boolean;
    minlength: number;
    value: string;
}
