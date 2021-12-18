import { Suspense } from "react";
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

const theme = createTheme({
    palette: {
        type: "light",
        primary: {
            main: "#04acf3", // TODO: change to your primary-color
        },
        secondary: {
            main: "#0cd444", // TODO: change to your secondary-color
        },
        warning: {
            main: "#fb7c24", // TODO: change to your warning-color
        },
        background: {
            default: "#111111",
            paper: "#222222",
        },
        text: {
            primary: "#333333",
            secondary: "#bbbbbb",
        },
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
    return (
        <Suspense fallback="loading">
            <ThemeProvider theme={theme}>
                <div className={classes.app}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <PageRouter />
                    </MuiPickersUtilsProvider>
                </div>
            </ThemeProvider>
        </Suspense>
    );
}
