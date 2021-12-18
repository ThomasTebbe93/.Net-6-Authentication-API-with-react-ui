import React, { useState } from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { IconButton } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Page from "../../../components/layout/Page";
import DeleteDialogue from "../../../components/dialogues/DeleteDialogue";
import { requestService } from "../../../services/requestService";
import { Role } from "../../../types/role";
import RoleFormPage from "./RoleFormPage";
import RoleTable from "./RoleTable";
import { Rights } from "../../../helpers/rights";
import { authenticationService } from "../../../services/authenticationService";
import { List } from "immutable";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: { padding: 10 },
    })
);

export default function RolePage() {
    const currentUser = authenticationService.currentUserValue;
    const canCreate =
        currentUser?.rights?.some(
            (x) => x === Rights.ADMINISTRATION_ROLES_CREATE
        ) ?? false;
    const { t } = useTranslation();
    const classes = useStyles();
    const [refreshCount, setRefreshCount] = useState<number>(0);
    const [slideInIsOpen, setSlideInIsOpen] = useState<boolean>(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

    const closeSlideIn = () => {
        refresh();
        setSelectedRole(null);
        setSlideInIsOpen(false);
    };

    const onRowClick = (data: Role) => {
        setSelectedRole(data);
        setSlideInIsOpen(true);
    };

    const onConfirmDelete = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        event.stopPropagation();
        event.preventDefault();
        requestService
            .get<boolean>(`/role/deleteByIdent/${roleToDelete?.ident?.ident}`)
            .then((res) => {
                setRoleToDelete(null);
                setRefreshCount(refreshCount + 1);
            });
    };

    const onAbortDelete = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        event.stopPropagation();
        event.preventDefault();
        setRoleToDelete(null);
    };

    const onDelete = (material: Role) => {
        setRoleToDelete(material);
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
            title={t("common.role")}
            slideInContend={
                <RoleFormPage
                    slideInIsOpen={slideInIsOpen}
                    closeSlideIn={closeSlideIn}
                    selectedRole={selectedRole}
                    refresh={refresh}
                />
            }
            actions={actions}
        >
            <div className={classes.paper}>
                <RoleTable
                    refreshCount={refreshCount}
                    key="RoleTable"
                    onRowClick={onRowClick}
                    onDeleteClick={onDelete}
                />
            </div>
            {roleToDelete && (
                <DeleteDialogue
                    title={t("role.deleteMessageShort", {
                        Name: roleToDelete?.name,
                    })}
                    body={t("role.deleteMessageLong")}
                    width={400}
                    height={300}
                    onConfirm={onConfirmDelete}
                    onAbort={onAbortDelete}
                />
            )}
        </Page>
    );
}
