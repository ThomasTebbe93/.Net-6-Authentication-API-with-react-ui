import React from "react";
import { Grid, makeStyles, createStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        grid: {
            alignItems: "center",
        },
        gridHeader: {
            alignItems: "center",
            fontSize: 18,
            fontWeight: 600,
        },
    })
);

interface Props {
    children: React.ReactNode;
    header?: React.ReactNode;
}

export default function FormSection({ children, header }: Props) {
    const classes = useStyles();
    return (
        <>
            {header && (
                <Grid container spacing={0} className={classes.gridHeader}>
                    {header}
                </Grid>
            )}
            <Grid container spacing={0} className={classes.grid}>
                {children}
            </Grid>
        </>
    );
}
