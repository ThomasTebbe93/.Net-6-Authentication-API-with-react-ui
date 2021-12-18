import React, { useEffect, useState } from "react";
import SlideIn from "../../../components/layout/SlideIn";
import {
    makeStyles,
    Theme,
    createStyles,
    Fab,
    TextField,
    IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";
import { requestService } from "../../../services/requestService";
import LoadingBars from "../../../components/loadingAnimations/LoadingBars";
import { User } from "../../../types/user";
import FormInput from "../../../components/layout/formpage/FormInput";
import FormSection from "../../../components/layout/formpage/FormSection";
import { List } from "immutable";
import {
    RequestResult,
    StatusCode,
    ValidationFailure,
} from "../../../types/requestResult";
import { useTranslation } from "react-i18next";
import RoleInputSelect from "../../../components/inputs/RoleInputSelect";
import { authenticationService } from "../../../services/authenticationService";
import { Rights } from "../../../helpers/rights";

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
        grid: {
            alignItems: "center",
        },
        input: {
            color: theme.palette.getContrastText(
                theme.palette.background.default
            ),
        },
    })
);

interface Props {
    slideInIsOpen: boolean;
    closeSlideIn: () => void;
    refresh: () => void;
    selectedUser: User | null;
}

export default function UserFormPage(props: Props) {
    const currentUser = authenticationService.currentUserValue;
    const canEdit =
        (currentUser?.rights?.some(
            (x) => x === Rights.ADMINISTRATION_USERS_CREATE
        ) ||
            (currentUser?.rights?.some(
                (x) => x === Rights.ADMINISTRATION_USERS_EDIT
            ) &&
                !props.selectedUser)) ??
        false;

    const { t } = useTranslation();
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [user, setUser] = useState<User | null>(null);
    const [validationFailures, setValidationFailures] =
        useState<List<ValidationFailure> | null>(null);
    const [hasInternalError, setHasInternalError] = useState<boolean>(false);

    useEffect(() => {
        if (props.selectedUser !== undefined && props.selectedUser !== null) {
            requestService
                .get<User>(
                    `/user/getByIdent/${props.selectedUser?.ident?.ident}`
                )
                .then((res) => {
                    setUser(res);
                    setIsLoading(false);
                });
        }
        if (!props.selectedUser) {
            setIsLoading(false);
        }
    }, [props.selectedUser]);

    const onCloseSlideIn = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        event.stopPropagation();
        event.preventDefault();
        onClose();
    };

    const onClose = () => {
        setValidationFailures(null);
        setHasInternalError(false);
        setUser(null);
        props.closeSlideIn();
    };

    const onSave = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        event.preventDefault();
        requestService
            .post<RequestResult>(`/User/createorupdate`, [
                {
                    ident: user?.ident?.ident,
                    firstName: user?.firstName,
                    lastName: user?.lastName,
                    userName: user?.userName,
                    password: user?.password,
                    passwordRetyped: user?.passwordRetyped,
                    role: user?.role,
                    roleIdent: user?.role?.ident.ident,
                },
            ])
            .then((res) => {
                if (res.statusCode === StatusCode.validationError)
                    setValidationFailures(res.validationFailures);
                if (res.statusCode === StatusCode.internalServerError)
                    setHasInternalError(true);
                if (res.statusCode === StatusCode.ok) {
                    props.refresh();
                    setUser(null);
                    setValidationFailures(null);
                    setHasInternalError(false);
                    props.closeSlideIn();
                }
            });
    };

    const onChangeFirstname = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newUser = { ...user, firstName: e.target.value } as User;
        setUser(newUser);
    };
    const onChangeLastname = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newUser = { ...user, lastName: e.target.value } as User;
        setUser(newUser);
    };
    const onChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newUser = { ...user, userName: e.target.value } as User;
        setUser(newUser);
    };
    const onChangeRole = (value: unknown) => {
        const newUser = { ...user, role: value } as User;
        setUser(newUser);
    };
    const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newUser = { ...user, password: e.target.value } as User;
        setUser(newUser);
    };
    const onChangePasswordRepeate = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const newUser = { ...user, passwordRetyped: e.target.value } as User;
        setUser(newUser);
    };

    return (
        <SlideIn slideInIsOpen={props.slideInIsOpen} onCloseSlidein={onClose}>
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
                                {user && user.ident?.ident
                                    ? `${user?.firstName} ${user?.lastName} ${t(
                                          "action.update"
                                      )}`
                                    : t("action.createSomething", {
                                          something: t("common.member"),
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
                            <FormInput label={t("common.firstName")}>
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
                                            failure.propertyName === "FirstName"
                                    )}
                                    helperText={t(
                                        validationFailures?.find(
                                            (failure: ValidationFailure) =>
                                                failure.propertyName ===
                                                "FirstName"
                                        )?.errorMessage ?? ""
                                    )}
                                    id="firstName"
                                    className={classes.formControl}
                                    value={user?.firstName ?? ""}
                                    onChange={onChangeFirstname}
                                />
                            </FormInput>
                            <FormInput label={t("common.lastName")}>
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
                                            failure.propertyName === "LastName"
                                    )}
                                    helperText={t(
                                        validationFailures?.find(
                                            (failure: ValidationFailure) =>
                                                failure.propertyName ===
                                                "LastName"
                                        )?.errorMessage ?? ""
                                    )}
                                    id="lastName"
                                    className={classes.formControl}
                                    value={user?.lastName ?? ""}
                                    onChange={onChangeLastname}
                                />
                            </FormInput>
                            <FormInput label={t("common.mailAddress")}>
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
                                            failure.propertyName === "UserName"
                                    )}
                                    helperText={t(
                                        validationFailures?.find(
                                            (failure: ValidationFailure) =>
                                                failure.propertyName ===
                                                "UserName"
                                        )?.errorMessage ?? ""
                                    )}
                                    id="userName"
                                    className={classes.formControl}
                                    value={user?.userName ?? ""}
                                    onChange={onChangeUsername}
                                />
                            </FormInput>
                            <FormInput label={t("common.role")}>
                                <RoleInputSelect
                                    disabled={!canEdit}
                                    onChange={onChangeRole}
                                    value={user?.role}
                                />
                            </FormInput>
                            <FormInput label={t("common.password")}>
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
                                            failure.propertyName === "Password"
                                    )}
                                    helperText={t(
                                        validationFailures?.find(
                                            (failure: ValidationFailure) =>
                                                failure.propertyName ===
                                                "Password"
                                        )?.errorMessage ?? ""
                                    )}
                                    id="password"
                                    className={classes.formControl}
                                    value={user?.password ?? ""}
                                    onChange={onChangePassword}
                                />
                            </FormInput>
                            <FormInput label={t("user.passwordRetype")}>
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
                                            failure.propertyName ===
                                            "PasswordRetyped"
                                    )}
                                    helperText={t(
                                        validationFailures?.find(
                                            (failure: ValidationFailure) =>
                                                failure.propertyName ===
                                                "PasswordRetyped"
                                        )?.errorMessage ?? ""
                                    )}
                                    id="passwordRetyped"
                                    className={classes.formControl}
                                    value={user?.passwordRetyped ?? ""}
                                    onChange={onChangePasswordRepeate}
                                />
                            </FormInput>
                        </FormSection>
                    </div>
                </>
            )}
        </SlideIn>
    );
}
