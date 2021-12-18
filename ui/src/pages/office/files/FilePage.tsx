import React, { useState } from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import Page from "../../../components/layout/Page";
import { requestService } from "../../../services/requestService";
import DeleteDialogue from "../../../components/dialogues/DeleteDialogue";
import { File } from "../../../types/file";
import FileTable from "./FileTable";
import { List } from "immutable";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: { padding: 10 },
    })
);

export default function FilePage() {
    const { t } = useTranslation();
    const classes = useStyles();
    const [refreshCount, setRefreshCount] = useState<number>(0);
    const [fileToDelete, setfileToDelete] = useState<File | null>(null);

    const onConfirmDelete = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        event.stopPropagation();
        event.preventDefault();
        requestService
            .get<boolean>(`/file/deleteByIdent/${fileToDelete?.ident?.ident}`)
            .then((res) => {
                setfileToDelete(null);
                setRefreshCount(refreshCount + 1);
            });
    };

    const onAbortDelete = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        event.stopPropagation();
        event.preventDefault();
        setfileToDelete(null);
    };

    const onDelete = (file: File) => {
        setfileToDelete(file);
    };

    return (
        <Page
            title={t("common.myFiles")}
            slideInContend={null}
            actions={List<React.ReactNode>()}
        >
            <div className={classes.paper}>
                <FileTable
                    refreshCount={refreshCount}
                    key="FileTable"
                    onRowClick={() => {}}
                    onDeleteClick={onDelete}
                />
            </div>
            {fileToDelete && (
                <DeleteDialogue
                    title={t("file.deleteMessageShort", {
                        Name: fileToDelete?.name,
                    })}
                    body={t("file.deleteMessageLong")}
                    width={400}
                    height={300}
                    onConfirm={onConfirmDelete}
                    onAbort={onAbortDelete}
                />
            )}
        </Page>
    );
}
