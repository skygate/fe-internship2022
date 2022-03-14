import { createTheme } from "@mui/material";

export const theme = createTheme({
    colors: {
        darkGrey: "#7C7A7A",
        lightGrey: "#C4C4C4",
        lightBlue: "#00E0FF",
        black: "hsl(0, 0%, 0%)",
        red: "#FF0000",
        white: "white",
        KOLOR: "#12E6E6",
    },
    fontWeight: {
        extraLight: 300,
        Light: 400,
        medium: 500,
        bold: 600,
    },
    fontSize: {
        s: "12px",
        m: "24px",
        l: "36px",
    },
    margin: {
        xs: "10x",
        s: "20px",
        m: "30px",
        l: "40px",
        xl: "50px",
        xxl: "300px",
    },
});
