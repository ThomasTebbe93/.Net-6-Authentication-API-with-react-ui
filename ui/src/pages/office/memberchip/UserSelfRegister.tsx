import React, { useState } from "react";
import { ReactComponent as Icon } from "../../../images/logo/logo.svg";
import { User } from "../../../types/user";
import { useTranslation } from "react-i18next";
import { List } from "immutable";
import { getBaseUrl, headerWithJson } from "../../../services/requestService";
import {
    RequestResult,
    StatusCode,
    ValidationFailure,
} from "../../../types/requestResult";
import {
    makeStyles,
    Theme,
    createStyles,
    TextField,
    Paper,
    Fab,
} from "@material-ui/core";
import FormSection from "../../../components/layout/formpage/FormSection";
import FormInput from "../../../components/layout/formpage/FormInput";
import PersonAddOutlinedIcon from "@material-ui/icons/PersonAddOutlined";
import { history } from "../../../helpers/history";
import queryString from "query-string";
import { Alert } from "@material-ui/lab";
import LawFooter from "../../../components/LawFooter";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        slideInHeader: {
            padding: 10,
            borderBottomStyle: "solid",
            borderBottomColor: theme.palette.getContrastText(
                theme.palette.background.default
            ),
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

export default function UserSelfRegister() {
    const { t } = useTranslation();
    const classes = useStyles();
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [validationFailures, setValidationFailures] =
        useState<List<ValidationFailure> | null>(null);
    const [hasInternalError, setHasInternalError] = useState<boolean>(false);

    const onSave = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        event.preventDefault();
        const params = queryString.parse(history.location.search);
        const body = {
            ident: null,
            customerNumber: parseInt((params?.customerId as string) ?? ""),
            hash: params.hash,
            firstName: user?.firstName,
            lastName: user?.lastName,
            userName: user?.userName,
            password: user?.password,
            passwordRetyped: user?.passwordRetyped,
        };
        fetch(`${getBaseUrl()}/register/register`, {
            method: "POST",
            headers: headerWithJson(),
            body: JSON.stringify(body),
        })
            .then((response) => {
                if (!response.ok) {
                    if ([400, 401, 403].indexOf(response.status) !== -1) {
                        setIsSaving(false);
                    }
                }
                return response.json();
            })
            .then((res: RequestResult) => {
                if (res.statusCode === StatusCode.validationError)
                    setValidationFailures(res.validationFailures);
                if (res.statusCode === StatusCode.internalServerError)
                    setHasInternalError(true);
                if (res.statusCode === StatusCode.ok) {
                    setUser(null);
                    setValidationFailures(null);
                    setHasInternalError(false);
                    history.replace("/login");
                }
                setIsSaving(false);
            })
            .catch((x) => {
                setHasInternalError(false);
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
        <div
            style={{
                width: "100%",
                height: "100%",
                padding: 10,
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
            }}
        >
            <Paper style={{ width: 600, padding: 10 }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        padding: 10,
                    }}
                >
                    <div style={{ display: "inline-block" }}>
                        <Icon style={{ height: 70, width: 70 }} />
                    </div>
                </div>

                <Alert severity="info">
                    <span>
                        {t("helpMessage.userSelfRegisterWelcome", {
                            applicationNam: t("application.name"),
                        })}
                    </span>
                    <p>
                        {t("helpMessage.userSelfRegister", {
                            organisation: t("application.name"),
                        })}
                    </p>
                    <p>
                        {t("helpMessage.userSelfRegisterHaveFun", {
                            applicationNam: t("application.name"),
                        })}
                    </p>
                </Alert>

                <FormSection>
                    <FormInput label={t("common.firstName")}>
                        <TextField
                            InputProps={{
                                classes: {
                                    input: classes.input,
                                },
                            }}
                            autoComplete="off"
                            error={validationFailures?.some(
                                (failure: ValidationFailure) =>
                                    failure.propertyName === "FirstName"
                            )}
                            helperText={t(
                                validationFailures?.find(
                                    (failure: ValidationFailure) =>
                                        failure.propertyName === "FirstName"
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
                            error={validationFailures?.some(
                                (failure: ValidationFailure) =>
                                    failure.propertyName === "LastName"
                            )}
                            helperText={t(
                                validationFailures?.find(
                                    (failure: ValidationFailure) =>
                                        failure.propertyName === "LastName"
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
                            error={validationFailures?.some(
                                (failure: ValidationFailure) =>
                                    failure.propertyName === "UserName"
                            )}
                            helperText={t(
                                validationFailures?.find(
                                    (failure: ValidationFailure) =>
                                        failure.propertyName === "UserName"
                                )?.errorMessage ?? ""
                            )}
                            id="userName"
                            className={classes.formControl}
                            value={user?.userName ?? ""}
                            onChange={onChangeUsername}
                        />
                    </FormInput>
                    <FormInput label={t("common.password")}>
                        <TextField
                            InputProps={{
                                classes: {
                                    input: classes.input,
                                },
                            }}
                            type="password"
                            autoComplete="off"
                            error={validationFailures?.some(
                                (failure: ValidationFailure) =>
                                    failure.propertyName === "Password"
                            )}
                            helperText={t(
                                validationFailures?.find(
                                    (failure: ValidationFailure) =>
                                        failure.propertyName === "Password"
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
                            type="password"
                            error={validationFailures?.some(
                                (failure: ValidationFailure) =>
                                    failure.propertyName === "PasswordRetyped"
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
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: 25,
                    }}
                >
                    <Fab
                        color="primary"
                        variant="extended"
                        size="small"
                        onClick={isSaving ? () => {} : onSave}
                    >
                        <PersonAddOutlinedIcon
                            className={classes.extendedIcon}
                        />
                        {t("action.register")}
                    </Fab>
                </div>
                <LawFooter />
            </Paper>
        </div>
    );
}
