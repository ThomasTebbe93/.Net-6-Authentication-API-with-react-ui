import React from "react";
import { createStyles, makeStyles, Theme, Paper } from "@material-ui/core";

const useStyles = (width?: number, height?: number) =>
    makeStyles((theme: Theme) =>
        createStyles({
            root: {
                position: "fixed",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#ccccccc0",
            },
            paper: {
                width: width ?? 500,
                height: height ?? 500,
                backgroundColor: "#fff",
                position: "relative",
            },
            header: {
                padding: 10,
                backgroundColor: "#ffffff",
                borderBottomStyle: "solid",
                borderBottomColor: "#333",
                borderBottomWidth: 2,
                justifyContent: "space-between",
                display: "flex",
            },
            body: {
                padding: 10,
                display: "flex",
                justifyContent: "space-between",
            },
            footer: {
                padding: 10,
                display: "flex",
                justifyContent: "space-between",
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
            },
        })
    )();

interface Props {
    width?: number;
    height?: number;
    title: string;
    body: string;
    actions: React.ReactNode[];
}

export default function Dialogue(props: Props) {
    const classes = useStyles(props.width, props.height);

    return (
        <div className={classes.root}>
            <Paper elevation={3} className={classes.paper}>
                <div className={classes.header}>
                    <span style={{ fontSize: 22 }}>{props.title}</span>
                </div>
                <div className={classes.body}>
                    <span style={{ fontSize: 16 }}>{props.body}</span>
                </div>
                <div className={classes.footer}>{props.actions}</div>
            </Paper>
        </div>
    );
}
