import React from "react";
import { createStyles, makeStyles, Theme, Fab } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import { useTranslation } from "react-i18next";
import Dialogue from "./Dialogue";

interface Props {
    width?: number;
    height?: number;
    title: string;
    body: string;
    onConfirm: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onAbort: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const useStyles = (width?: number, height?: number) =>
    makeStyles((theme: Theme) =>
        createStyles({
            extendedIcon: {
                marginRight: theme.spacing(1),
            },
        })
    )();

export default function DeleteDialogue(props: Props) {
    const { t } = useTranslation();
    const classes = useStyles(props.width, props.height);

    const actions = [
        <Fab variant="extended" size="small" onClick={props.onAbort}>
            <CloseIcon className={classes.extendedIcon} />
            {t("action.abort")}
        </Fab>,
        <Fab
            color="secondary"
            variant="extended"
            size="small"
            onClick={props.onConfirm}
        >
            <DeleteIcon className={classes.extendedIcon} />
            {t("action.delete")}
        </Fab>,
    ];

    return (
        <Dialogue
            title={props.title}
            body={props.body}
            width={props.width}
            height={props.height}
            actions={actions}
        />
    );
}
