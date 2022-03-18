import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";

export default function MainContext({ children }) {
    return (
        <React.Fragment>
            <CssBaseline />
            <Grid container columnSpacing={2}>
                {children}
            </Grid>
        </React.Fragment>
    );
}
