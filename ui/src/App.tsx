import { createContext, Suspense, useMemo, useState } from "react";
import {
    createStyles,
    createTheme,
    makeStyles,
    Theme,
    ThemeProvider,
} from "@material-ui/core/styles";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import PageRouter from "./router/PageRouter";
import { PaletteType } from "@material-ui/core";

const getDesignTokens = (mode: PaletteType) => ({
    palette: {
        ...(mode === "light"
            ? {
                  type: "light" as PaletteType,
                  primary: {
                      main: "#04acf3", // TODO: change to your primary-color #fb7c24
                  },
                  secondary: {
                      main: "#fb7c24", // TODO: change to your secondary-color
                  },
                  warning: {
                      main: "#fb7c24", // TODO: change to your warning-color
                  },
              }
            : {
                  type: "dark" as PaletteType,
                  primary: {
                      main: "#04acf3", // TODO: change to your primary-color
                  },
                  secondary: {
                      main: "#fb7c24", // TODO: change to your secondary-color
                  },
                  warning: {
                      main: "#fb7c24", // TODO: change to your warning-color
                  },
              }),
    },
});

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        app: {
            width: "100%",
            height: "100%",
        },
    })
);

export default function App() {
    const classes = useStyles();
    const [mode, setMode] = useState<PaletteType>("light");
    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode: PaletteType) =>
                    prevMode === "light" ? "dark" : "light"
                );
            },
        }),
        []
    );

    const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
    const ColorModeContext = createContext({ toggleColorMode: () => {} });

    return (
        <Suspense fallback="loading">
            <ColorModeContext.Provider value={colorMode}>
                <ThemeProvider theme={theme}>
                    <div className={classes.app}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <PageRouter colorModeContext={ColorModeContext} />
                        </MuiPickersUtilsProvider>
                    </div>
                </ThemeProvider>
            </ColorModeContext.Provider>
        </Suspense>
    );
}
