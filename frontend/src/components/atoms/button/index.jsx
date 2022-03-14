import React from "react";
import { Button } from "@mui/material";
import styled from "@emotion/styled";

const StyledButton = styled(Button)`
    background-color: ${({ theme }) => theme.colors.darkGrey};
`;

export const ButtonElement = ({ children, data }) => {
    return <StyledButton onClick={data}>{children}</StyledButton>;
};
