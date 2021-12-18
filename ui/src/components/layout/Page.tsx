import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import { List } from "immutable";

interface Props {
    title?: string;
    actions?: List<React.ReactNode>;
    children: React.ReactNode;
    headerElements?: React.ReactNode;
    slideInContend?: React.ReactNode;
}

export default function Page(props: Props) {
    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            page: {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                height: "100%",
                display: "relative",
            },
            contend1: {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                height: "100%",
                overflow: "scroll",
                overflowX: "hidden",
                display: "relative",
            },
            header: {
                padding: 10,
                borderBottomStyle: "solid",
                borderBottomColor: theme.palette.getContrastText(
                    theme.palette.background.default
                ),
                borderBottomWidth: 1,
                display: "flex",
                justifyContent: "space-between",
            },
            actionsContainer: {
                display: "flex",
            },
            actionContainer: {
                paddingLeft: 10,
            },
        })
    );
    const classes = useStyles();

    return (
        <>
            <div className={classes.page}>
                <div className={classes.header}>
                    <div style={{ fontSize: 22 }}>
                        {props.title}

                        {props.headerElements}
                    </div>
                    <div className={classes.actionsContainer}>
                        {props.actions?.map((action) => (
                            <div className={classes.actionContainer}>
                                {action}
                            </div>
                        ))}
                    </div>
                </div>
                <div className={classes.contend1}>
                    <div style={{ paddingBottom: 100 }}>{props.children}</div>
                </div>
            </div>
            {props.slideInContend}
        </>
    );
}
