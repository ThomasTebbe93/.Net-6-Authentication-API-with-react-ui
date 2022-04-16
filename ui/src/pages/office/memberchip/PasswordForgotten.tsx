import React, { useState } from "react";
import { ReactComponent as Icon } from "../../../images/logo/logo.svg";
import { AuthenticationUser, User } from "../../../types/user";
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
import { useEffect } from "react";
import { history } from "../../../helpers/history";
import queryString from "query-string";
import LoadingBars from "../../../components/loadingAnimations/LoadingBars";
import { Alert } from "@material-ui/lab";
import LawFooter from "../../../components/LawFooter";
import { SaveOutlined } from "@material-ui/icons";
import { authenticationService } from "../../../services/authenticationService";

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

export default function PasswordForgotten() {
    const { t } = useTranslation();
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [validationFailures, setValidationFailures] =
        useState<List<ValidationFailure> | null>(null);
    const [hasInternalError, setHasInternalError] = useState<boolean>(false);
    const [hasInvalidHash, setHasInvalidHash] = useState<boolean>(false);

    const onSave = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        event.preventDefault();
        const params = queryString.parse(history.location.search);
        const body = {
            userIdent: (params?.userIdent as string) ?? "",
            hash: params.hash,
            passwordNew: user?.password,
            passwordNewRetyped: user?.passwordRetyped,
        };
        fetch(`${getBaseUrl()}/user/resetPassword`, {
            method: "POST",
            headers: headerWithJson(),
            body: JSON.stringify(body),
        })
            .then((response) => {
                if (!response.ok) {
                    if ([400, 401, 403].indexOf(response.status) !== -1) {
                        setHasInvalidHash(true);
                        setIsSaving(false);
                    }
                }
                return response.json();
            })
            .then((res: RequestResult | AuthenticationUser) => {
                if (res as AuthenticationUser) {
                    authenticationService.renewUser(res as AuthenticationUser);
                    setValidationFailures(null);
                    history.replace("/dashboard");
                }
                if (
                    (res as RequestResult).statusCode ===
                    StatusCode.validationError
                )
                    setValidationFailures(
                        (res as RequestResult).validationFailures
                    );
                if (
                    (res as RequestResult).statusCode ===
                    StatusCode.internalServerError
                )
                    setHasInternalError(true);
                setIsSaving(false);
            })
            .catch((x) => {
                setHasInternalError(false);
            });
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

    useEffect(() => {
        const body = queryString.parse(history.location.search);
        fetch(`${getBaseUrl()}/authentication/checkUserPasswordForgottenHash`, {
            method: "POST",
            headers: headerWithJson(),
            body: JSON.stringify({
                ...body,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    if ([400, 401, 403].indexOf(response.status) !== -1) {
                        setHasInvalidHash(true);
                    }
                } else {
                    setHasInvalidHash(false);
                    return response.json();
                }
            })
            .then((res: User) => {
                setUser(res);
                setIsLoading(false);
            })
            .catch((x) => {
                setHasInvalidHash(true);
                setIsLoading(false);
            });
    }, []);

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
            {!isLoading && (
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
                    {hasInvalidHash && (
                        <Alert severity="error">
                            {t("error.invalidPasswortResetHash")}
                        </Alert>
                    )}
                    {!hasInvalidHash && (
                        <Alert severity="info">
                            <span>
                                {t("helpMessage.userResetPasswordWelcome", {
                                    applicationNam: t("application.name"),
                                })}
                            </span>
                            <p>
                                {t("helpMessage.userResetPasswor", {
                                    organisation: user?.firstName,
                                })}
                            </p>
                            <p>{t("helpMessage.userResetPassworHaveFun")}</p>
                        </Alert>
                    )}
                    {!hasInvalidHash && (
                        <FormSection>
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
                                            failure.propertyName ===
                                            "PasswordNew"
                                    )}
                                    helperText={t(
                                        validationFailures?.find(
                                            (failure: ValidationFailure) =>
                                                failure.propertyName ===
                                                "PasswordNew"
                                        )?.errorMessage ?? ""
                                    )}
                                    id="passwordNew"
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
                                            failure.propertyName ===
                                            "PasswordNewRetyped"
                                    )}
                                    helperText={t(
                                        validationFailures?.find(
                                            (failure: ValidationFailure) =>
                                                failure.propertyName ===
                                                "PasswordNewRetyped"
                                        )?.errorMessage ?? ""
                                    )}
                                    id="passwordNewRetyped"
                                    className={classes.formControl}
                                    value={user?.passwordRetyped ?? ""}
                                    onChange={onChangePasswordRepeate}
                                />
                            </FormInput>
                        </FormSection>
                    )}
                    {!hasInvalidHash && (
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
                                <SaveOutlined
                                    className={classes.extendedIcon}
                                />
                                {t("action.setPassword")}
                            </Fab>
                        </div>
                    )}
                    <LawFooter />
                </Paper>
            )}
            {isLoading && (
                <Paper style={{ width: 600, padding: 10 }}>
                    <LoadingBars />
                </Paper>
            )}
        </div>
    );
}
