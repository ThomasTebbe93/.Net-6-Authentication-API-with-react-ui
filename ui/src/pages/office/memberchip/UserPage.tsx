import React, { useState } from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import UserFormPage from "./UserFormPage";
import UserTable from "./UserTable";
import { User } from "../../../types/user";
import Page from "../../../components/layout/Page";
import { requestService } from "../../../services/requestService";
import { useTranslation } from "react-i18next";
import DeleteDialogue from "../../../components/dialogues/DeleteDialogue";
import { IconButton } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { authenticationService } from "../../../services/authenticationService";
import { Rights } from "../../../helpers/rights";
import { List } from "immutable";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: { padding: 10 },
    })
);

export default function UserPage() {
    const currentUser = authenticationService.currentUserValue;
    const canCreate =
        currentUser?.rights?.some(
            (x) => x === Rights.ADMINISTRATION_USERS_CREATE
        ) ?? false;
    const { t } = useTranslation();
    const classes = useStyles();
    const [refreshCount, setRefreshCount] = useState<number>(0);
    const [slideInIsOpen, setSlideInIsOpen] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const closeSlideIn = () => {
        setSelectedUser(null);
        setSlideInIsOpen(false);
    };

    const onRowClick = (data: User) => {
        setSelectedUser(data);
        setSlideInIsOpen(true);
    };

    const onConfirmDelete = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        event.stopPropagation();
        event.preventDefault();
        requestService
            .get<boolean>(`/user/deleteByIdent/${userToDelete?.ident?.ident}`)
            .then((res) => {
                setUserToDelete(null);
                setRefreshCount(refreshCount + 1);
            });
    };

    const onAbortDelete = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        event.stopPropagation();
        event.preventDefault();
        setUserToDelete(null);
    };

    const onDelete = (user: User) => {
        setUserToDelete(user);
    };

    const refresh = () => setRefreshCount(refreshCount + 1);

    const onOpenSlideIn = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        setSlideInIsOpen(true);
    };

    const actions = List<React.ReactNode>().concat(
        canCreate && (
            <IconButton
                color="primary"
                aria-label="add"
                size="small"
                onClick={onOpenSlideIn}
            >
                <AddCircleIcon />
            </IconButton>
        )
    );

    return (
        <Page
            title={t("common.users")}
            slideInContend={
                <UserFormPage
                    slideInIsOpen={slideInIsOpen}
                    closeSlideIn={closeSlideIn}
                    selectedUser={selectedUser}
                    refresh={refresh}
                />
            }
            actions={actions}
        >
            <div className={classes.paper}>
                <UserTable
                    refreshCount={refreshCount}
                    key="userTable"
                    onRowClick={onRowClick}
                    onDeleteClick={onDelete}
                />
            </div>
            {userToDelete && (
                <DeleteDialogue
                    title={t("user.deleteMessageShort", {
                        firstName: userToDelete?.firstName,
                        lastName: userToDelete?.lastName,
                    })}
                    body={t("user.deleteMessageLong")}
                    width={400}
                    height={300}
                    onConfirm={onConfirmDelete}
                    onAbort={onAbortDelete}
                />
            )}
        </Page>
    );
}
