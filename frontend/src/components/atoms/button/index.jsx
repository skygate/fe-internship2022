import React from "react";
import { Button } from "@mui/material";
import styled from "@emotion/styled";

const StyledButton = styled(Button)`
    background-color: ${({ theme }) => theme.colors.lightBlue};
`;

export const ButtonElement = ({ children, onClick }) => {
    return <StyledButton onClick={onClick}>{children}</StyledButton>;
};
