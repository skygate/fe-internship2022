import React from "react";

export enum RegisterInputType {
    Email="email",
    Username="username",
    Password="password",
    ConfirmPassword="confirmPassword"
}

export interface RegisterInputs {
    name: RegisterInputType;
    id: string;
    label: string;
    placeholder: string;
    type: string;
}
