import React from "react";
import { Grid } from "@material-ui/core";
import { GridSize } from "@material-ui/core/Grid/Grid";

interface Props {
    label?: string;
    lableWidth?: GridSize;
    inputWidth?: GridSize;
    children: React.ReactNode;
}

export default function FormInput({
    label,
    children,
    inputWidth,
    lableWidth,
}: Props) {
    return (
        <>
            {label && (
                <Grid item xs={12} sm={lableWidth ?? 3}>
                    {label}
                </Grid>
            )}
            <Grid item xs={12} sm={inputWidth ?? 9}>
                {children}
            </Grid>
        </>
    );
}
