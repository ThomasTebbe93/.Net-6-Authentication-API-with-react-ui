import React, { useEffect, useState } from "react";
import { LinearProgress } from "@material-ui/core";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        progress50: {
            margin: theme.spacing(1),
            height: 20,
            width: "50%",
        },
        progress75: {
            margin: theme.spacing(1),
            height: 20,
            width: "75%",
        },
        progress100: {
            margin: theme.spacing(1),
            height: 20,
            width: "100%",
        },
        progress90: {
            margin: theme.spacing(1),
            height: 20,

            width: "90%",
        },
        progress45: {
            margin: theme.spacing(1),
            height: 20,
            width: "45%",
        },
        progress35: {
            margin: theme.spacing(1),
            height: 20,
            width: "35%",
        },
    })
);

export default function LoadingBars() {
    const classes = useStyles();
    const startTime = Date.now();
    const [seconds, setSeconds] = useState<number>(0);

    useEffect(() => {
        setTimeout(() => {
            setSeconds(seconds + (Date.now() - startTime) / 1000);
        }, 200);
    }, [seconds, startTime]);

    return (
        <>
            <LinearProgress
                variant="determinate"
                value={2.5 * seconds}
                className={classes.progress100}
            />
            <LinearProgress
                color="secondary"
                variant="determinate"
                value={seconds}
                className={classes.progress90}
            />
            <LinearProgress
                variant="determinate"
                value={1.5 * seconds}
                className={classes.progress35}
            />
            <LinearProgress
                color="secondary"
                variant="determinate"
                value={1.78 * seconds}
                className={classes.progress75}
            />
            <LinearProgress
                color="secondary"
                variant="determinate"
                value={1.28 * seconds}
                className={classes.progress45}
            />
            <LinearProgress
                variant="determinate"
                value={1.8 * seconds}
                className={classes.progress50}
            />
            <LinearProgress
                color="secondary"
                variant="determinate"
                value={0.35 * seconds}
                className={classes.progress50}
            />
            <LinearProgress
                variant="determinate"
                value={0.85 * seconds}
                className={classes.progress35}
            />
            <LinearProgress
                variant="determinate"
                value={0.48 * seconds}
                className={classes.progress75}
            />
        </>
    );
}
