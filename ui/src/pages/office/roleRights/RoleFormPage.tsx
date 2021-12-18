import React, { useEffect, useState } from "react";
import {
    makeStyles,
    Theme,
    createStyles,
    Fab,
    TextField,
    FormControlLabel,
    FormGroup,
    Divider,
    IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";
import { useTranslation } from "react-i18next";
import { List } from "immutable";
import FormInput from "../../../components/layout/formpage/FormInput";
import FormSection from "../../../components/layout/formpage/FormSection";
import SlideIn from "../../../components/layout/SlideIn";
import LoadingBars from "../../../components/loadingAnimations/LoadingBars";
import { requestService } from "../../../services/requestService";
import {
    ValidationFailure,
    RequestResult,
    StatusCode,
} from "../../../types/requestResult";
import RightCheckbox from "../../../components/inputs/RightCheckbox";
import { Role } from "../../../types/role";
import { Right } from "../../../types/right";
import {
    AdministrationFilesRights,
    AdministrationRights,
    AdministrationRolesRights,
    AdministrationSettingsRights,
    AdministrationUserRights,
    Rights,
} from "../../../helpers/rights";
import { authenticationService } from "../../../services/authenticationService";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        slideInHeader: {
            padding: 10,
            borderBottomStyle: "solid",
            borderBottomColor: "#333",
            borderBottomWidth: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
        },
        slideInHeaderLeft: {
            display: "flex",
            alignItems: "center",
        },
        slideInHeaderTitle: {
            fontSize: 22,
            marginLeft: 10,
        },
        slideInBody: {
            padding: 10,
        },
        extendedIcon: {
            marginRight: theme.spacing(1),
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 300,
            display: "flex",
        },
        input: {
            color: theme.palette.getContrastText(
                theme.palette.background.default
            ),
        },
        subSection: {
            background: theme.palette.background.default,
            color: theme.palette.getContrastText(
                theme.palette.background.paper
            ),
            padding: "0px 10px 10px 10px",
            borderRadius: 4,
        },
        subSubSection: {
            background: theme.palette.background.paper,
            color: theme.palette.getContrastText(
                theme.palette.background.paper
            ),
            padding: "0px 10px 10px 10px",
            borderRadius: 4,
        },
    })
);

interface Props {
    slideInIsOpen: boolean;
    closeSlideIn: () => void;
    selectedRole: Role | null;
    refresh: () => void;
}

export default function RoleFormPage(props: Props) {
    const currentUser = authenticationService.currentUserValue;
    const canEdit =
        (currentUser?.rights?.some(
            (x) => x === Rights.ADMINISTRATION_ROLES_EDIT
        ) ||
            (currentUser?.rights?.some(
                (x) => x === Rights.ADMINISTRATION_ROLES_CREATE
            ) &&
                !props.selectedRole)) ??
        false;
    const { t } = useTranslation();
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [role, setRole] = useState<Role | null>();
    const [rights, setRights] = useState<List<string>>(List());
    const [validationFailures, setValidationFailures] =
        useState<List<ValidationFailure> | null>(null);
    const [hasInternalError, setHasInternalError] = useState<boolean>(false);

    useEffect(() => {
        if (props.selectedRole !== undefined && props.selectedRole !== null) {
            requestService
                .get<Role>(
                    `/role/getByIdent/${props.selectedRole?.ident?.ident}`
                )
                .then((res) => {
                    setRole(res);
                    setRights(res.rights.map((x: Right) => x.key));
                    setIsLoading(false);
                });
        }
        if (!props.selectedRole) {
            setIsLoading(false);
        }
    }, [props.selectedRole]);

    const onCloseSlideIn = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        event.stopPropagation();
        event.preventDefault();
        setRole(null);
        setValidationFailures(null);
        setRights(List());
        props.closeSlideIn();
    };

    const onSave = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        event.preventDefault();

        requestService
            .post<RequestResult>(`/role/createorupdate`, [
                {
                    ident: role?.ident?.ident,
                    name: role?.name,
                    description: role?.description,
                    rights: rights.map((x: string) => {
                        return { key: x } as Right;
                    }),
                },
            ])
            .then((res) => {
                if (res.statusCode === StatusCode.validationError)
                    setValidationFailures(res.validationFailures);
                if (res.statusCode === StatusCode.internalServerError)
                    setHasInternalError(true);
                if (res.statusCode === StatusCode.ok) {
                    props.refresh();
                    setRole(null);
                    setValidationFailures(null);
                    setHasInternalError(false);
                    props.closeSlideIn();
                }
            });
    };

    const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newRole = {
            ...role,
            name: e.target.value,
        } as Role;
        setRole(newRole);
    };
    const onChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newRole = {
            ...role,
            description: e.target.value,
        } as Role;
        setRole(newRole);
    };

    const handleChange = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        rightKey: string,
        value: boolean
    ) => {
        event.preventDefault();
        setRights(
            value
                ? List(rights).push(rightKey)
                : removeChildRights(rights, rightKey)
        );
    };

    const removeChildRights = (rights: List<string>, rightKey: string) => {
        switch (rightKey) {
            case Rights.ADMINISTRATION:
                return rights.filter(
                    (right) => !AdministrationRights.some((x) => x === right)
                );
            case Rights.ADMINISTRATION_FILES:
                return rights.filter(
                    (right) =>
                        !AdministrationFilesRights.some((x) => x === right)
                );
            case Rights.ADMINISTRATION_USERS:
                return rights.filter(
                    (right) =>
                        !AdministrationUserRights.some((x) => x === right)
                );
            case Rights.ADMINISTRATION_ROLES:
                return rights.filter(
                    (right) =>
                        !AdministrationRolesRights.some((x) => x === right)
                );
            case Rights.ADMINISTRATION_SETTINGS:
                return rights.filter(
                    (right) =>
                        !AdministrationSettingsRights.some((x) => x === right)
                );
            default:
                return rights.filter((right) => right !== rightKey);
        }
    };

    return (
        <SlideIn
            slideInIsOpen={props.slideInIsOpen}
            onCloseSlidein={props.closeSlideIn}
        >
            {isLoading && <LoadingBars />}
            {!isLoading && (
                <>
                    <div className={classes.slideInHeader}>
                        <div className={classes.slideInHeaderLeft}>
                            <IconButton
                                color="secondary"
                                aria-label="add"
                                size="small"
                                onClick={onCloseSlideIn}
                            >
                                <CloseIcon />
                            </IconButton>
                            <span className={classes.slideInHeaderTitle}>
                                {role && role.ident?.ident
                                    ? `${role?.name} ${t("action.update")}`
                                    : t("action.createSomething", {
                                          something: t("common.role"),
                                      })}
                            </span>
                        </div>
                        {canEdit && (
                            <Fab
                                color="primary"
                                variant="extended"
                                size="small"
                                onClick={onSave}
                            >
                                <SaveIcon className={classes.extendedIcon} />
                                {t("action.save")}
                            </Fab>
                        )}
                    </div>
                    <div className={classes.slideInBody}>
                        <FormSection>
                            <FormInput label={t("common.name")}>
                                <TextField
                                    InputProps={{
                                        classes: {
                                            input: classes.input,
                                        },
                                    }}
                                    autoComplete="off"
                                    disabled={!canEdit}
                                    error={validationFailures?.some(
                                        (failure: ValidationFailure) =>
                                            failure.propertyName === "Name"
                                    )}
                                    helperText={t(
                                        validationFailures?.find(
                                            (failure: ValidationFailure) =>
                                                failure.propertyName === "Name"
                                        )?.errorMessage ?? ""
                                    )}
                                    id="name"
                                    className={classes.formControl}
                                    value={role?.name ?? ""}
                                    onChange={onChangeName}
                                />
                            </FormInput>
                            <FormInput label={t("common.description")}>
                                <TextField
                                    InputProps={{
                                        classes: {
                                            input: classes.input,
                                        },
                                    }}
                                    autoComplete="off"
                                    disabled={!canEdit}
                                    id="description"
                                    multiline
                                    rows={5}
                                    className={classes.formControl}
                                    variant="outlined"
                                    value={role?.description ?? ""}
                                    onChange={onChangeDescription}
                                />
                            </FormInput>
                        </FormSection>
                        <Divider />
                        <div>
                            <FormControlLabel
                                control={
                                    <RightCheckbox
                                        disabled={!canEdit}
                                        handleChange={handleChange}
                                        rigtKey={Rights.ADMINISTRATION}
                                        value={rights.some(
                                            (x) => x === Rights.ADMINISTRATION
                                        )}
                                    />
                                }
                                label={t(`rights.${Rights.ADMINISTRATION}`)}
                            />
                            {rights.some(
                                (x) => x === Rights.ADMINISTRATION
                            ) && (
                                <div style={{ marginLeft: 50 }}>
                                    <FormGroup
                                        aria-label="position"
                                        className={classes.subSection}
                                    >
                                        <FormControlLabel
                                            control={
                                                <RightCheckbox
                                                    disabled={!canEdit}
                                                    handleChange={handleChange}
                                                    rigtKey={
                                                        Rights.ADMINISTRATION_USERS
                                                    }
                                                    value={rights.some(
                                                        (x) =>
                                                            x ===
                                                            Rights.ADMINISTRATION_USERS
                                                    )}
                                                />
                                            }
                                            label={t(
                                                `rights.${Rights.ADMINISTRATION_USERS}`
                                            )}
                                        />
                                        {rights.some(
                                            (x) =>
                                                x ===
                                                Rights.ADMINISTRATION_USERS
                                        ) && (
                                            <div style={{ marginLeft: 50 }}>
                                                <FormGroup
                                                    aria-label="position"
                                                    className={
                                                        classes.subSubSection
                                                    }
                                                >
                                                    <FormControlLabel
                                                        control={
                                                            <RightCheckbox
                                                                disabled={
                                                                    !canEdit
                                                                }
                                                                handleChange={
                                                                    handleChange
                                                                }
                                                                rigtKey={
                                                                    Rights.ADMINISTRATION_USERS_CREATE
                                                                }
                                                                value={rights.some(
                                                                    (x) =>
                                                                        x ===
                                                                        Rights.ADMINISTRATION_USERS_CREATE
                                                                )}
                                                            />
                                                        }
                                                        label={t(
                                                            `rights.${Rights.ADMINISTRATION_USERS_CREATE}`
                                                        )}
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <RightCheckbox
                                                                disabled={
                                                                    !canEdit
                                                                }
                                                                handleChange={
                                                                    handleChange
                                                                }
                                                                rigtKey={
                                                                    Rights.ADMINISTRATION_USERS_EDIT
                                                                }
                                                                value={rights.some(
                                                                    (x) =>
                                                                        x ===
                                                                        Rights.ADMINISTRATION_USERS_EDIT
                                                                )}
                                                            />
                                                        }
                                                        label={t(
                                                            `rights.${Rights.ADMINISTRATION_USERS_EDIT}`
                                                        )}
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <RightCheckbox
                                                                disabled={
                                                                    !canEdit
                                                                }
                                                                handleChange={
                                                                    handleChange
                                                                }
                                                                rigtKey={
                                                                    Rights.ADMINISTRATION_USERS_DELETE
                                                                }
                                                                value={rights.some(
                                                                    (x) =>
                                                                        x ===
                                                                        Rights.ADMINISTRATION_USERS_DELETE
                                                                )}
                                                            />
                                                        }
                                                        label={t(
                                                            `rights.${Rights.ADMINISTRATION_USERS_DELETE}`
                                                        )}
                                                    />
                                                </FormGroup>
                                            </div>
                                        )}
                                        {/* Roles */}
                                        <FormControlLabel
                                            control={
                                                <RightCheckbox
                                                    disabled={!canEdit}
                                                    handleChange={handleChange}
                                                    rigtKey={
                                                        Rights.ADMINISTRATION_ROLES
                                                    }
                                                    value={rights.some(
                                                        (x) =>
                                                            x ===
                                                            Rights.ADMINISTRATION_ROLES
                                                    )}
                                                />
                                            }
                                            label={t(
                                                `rights.${Rights.ADMINISTRATION_ROLES}`
                                            )}
                                        />
                                        {rights.some(
                                            (x) =>
                                                x ===
                                                Rights.ADMINISTRATION_ROLES
                                        ) && (
                                            <div style={{ marginLeft: 50 }}>
                                                <FormGroup
                                                    aria-label="position"
                                                    className={
                                                        classes.subSubSection
                                                    }
                                                >
                                                    <FormControlLabel
                                                        control={
                                                            <RightCheckbox
                                                                disabled={
                                                                    !canEdit
                                                                }
                                                                handleChange={
                                                                    handleChange
                                                                }
                                                                rigtKey={
                                                                    Rights.ADMINISTRATION_ROLES_CREATE
                                                                }
                                                                value={rights.some(
                                                                    (x) =>
                                                                        x ===
                                                                        Rights.ADMINISTRATION_ROLES_CREATE
                                                                )}
                                                            />
                                                        }
                                                        label={t(
                                                            `rights.${Rights.ADMINISTRATION_ROLES_CREATE}`
                                                        )}
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <RightCheckbox
                                                                disabled={
                                                                    !canEdit
                                                                }
                                                                handleChange={
                                                                    handleChange
                                                                }
                                                                rigtKey={
                                                                    Rights.ADMINISTRATION_ROLES_EDIT
                                                                }
                                                                value={rights.some(
                                                                    (x) =>
                                                                        x ===
                                                                        Rights.ADMINISTRATION_ROLES_EDIT
                                                                )}
                                                            />
                                                        }
                                                        label={t(
                                                            `rights.${Rights.ADMINISTRATION_ROLES_EDIT}`
                                                        )}
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <RightCheckbox
                                                                disabled={
                                                                    !canEdit
                                                                }
                                                                handleChange={
                                                                    handleChange
                                                                }
                                                                rigtKey={
                                                                    Rights.ADMINISTRATION_ROLES_DELETE
                                                                }
                                                                value={rights.some(
                                                                    (x) =>
                                                                        x ===
                                                                        Rights.ADMINISTRATION_ROLES_DELETE
                                                                )}
                                                            />
                                                        }
                                                        label={t(
                                                            `rights.${Rights.ADMINISTRATION_ROLES_DELETE}`
                                                        )}
                                                    />
                                                </FormGroup>
                                            </div>
                                        )}

                                        {/* FILES */}
                                        <FormControlLabel
                                            control={
                                                <RightCheckbox
                                                    disabled={!canEdit}
                                                    handleChange={handleChange}
                                                    rigtKey={
                                                        Rights.ADMINISTRATION_FILES
                                                    }
                                                    value={rights.some(
                                                        (x) =>
                                                            x ===
                                                            Rights.ADMINISTRATION_FILES
                                                    )}
                                                />
                                            }
                                            label={t(
                                                `rights.${Rights.ADMINISTRATION_FILES}`
                                            )}
                                        />
                                        {rights.some(
                                            (x) =>
                                                x ===
                                                Rights.ADMINISTRATION_FILES
                                        ) && (
                                            <div style={{ marginLeft: 50 }}>
                                                <FormGroup
                                                    aria-label="position"
                                                    className={
                                                        classes.subSubSection
                                                    }
                                                >
                                                    <FormControlLabel
                                                        control={
                                                            <RightCheckbox
                                                                disabled={
                                                                    !canEdit
                                                                }
                                                                handleChange={
                                                                    handleChange
                                                                }
                                                                rigtKey={
                                                                    Rights.ADMINISTRATION_FILES_EDIT
                                                                }
                                                                value={rights.some(
                                                                    (x) =>
                                                                        x ===
                                                                        Rights.ADMINISTRATION_FILES_EDIT
                                                                )}
                                                            />
                                                        }
                                                        label={t(
                                                            `rights.${Rights.ADMINISTRATION_FILES_EDIT}`
                                                        )}
                                                    />
                                                </FormGroup>
                                            </div>
                                        )}

                                        {/* SETTINGS */}
                                        <FormControlLabel
                                            control={
                                                <RightCheckbox
                                                    disabled={!canEdit}
                                                    handleChange={handleChange}
                                                    rigtKey={
                                                        Rights.ADMINISTRATION_SETTINGS
                                                    }
                                                    value={rights.some(
                                                        (x) =>
                                                            x ===
                                                            Rights.ADMINISTRATION_SETTINGS
                                                    )}
                                                />
                                            }
                                            label={t(
                                                `rights.${Rights.ADMINISTRATION_SETTINGS}`
                                            )}
                                        />
                                        {rights.some(
                                            (x) =>
                                                x ===
                                                Rights.ADMINISTRATION_SETTINGS
                                        ) && (
                                            <div style={{ marginLeft: 50 }}>
                                                <FormGroup
                                                    aria-label="position"
                                                    className={
                                                        classes.subSubSection
                                                    }
                                                >
                                                    <FormControlLabel
                                                        control={
                                                            <RightCheckbox
                                                                disabled={
                                                                    !canEdit
                                                                }
                                                                handleChange={
                                                                    handleChange
                                                                }
                                                                rigtKey={
                                                                    Rights.ADMINISTRATION_SETTINGS_EDIT
                                                                }
                                                                value={rights.some(
                                                                    (x) =>
                                                                        x ===
                                                                        Rights.ADMINISTRATION_SETTINGS_EDIT
                                                                )}
                                                            />
                                                        }
                                                        label={t(
                                                            `rights.${Rights.ADMINISTRATION_SETTINGS_EDIT}`
                                                        )}
                                                    />
                                                </FormGroup>
                                            </div>
                                        )}
                                    </FormGroup>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </SlideIn>
    );
}
