import React, { useState } from "react";
import {
    createStyles,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    makeStyles,
    TextField,
    Theme,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import { ReactComponent as Icon } from "../../images/logo/logo.svg";
import { authenticationService } from "../../services/authenticationService";
import { useHistory } from "react-router";
import Button from "@material-ui/core/Button";
import SendIcon from "@material-ui/icons/Send";
import { useTranslation } from "react-i18next";
import { RequestResult, ValidationFailure } from "../../types/requestResult";
import { List } from "immutable";
import { AuthenticationUser } from "../../types/user";
import LawFooter from "../../components/LawFooter";
import { Alert } from "@material-ui/lab";

interface LoginProps {}
const ENTER_KEY = 13;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.palette.background.paper,
        },
        innerContainer: {
            padding: 50,
            backgroundColor: theme.palette.background.default,
            borderRadius: 10,
            textAlign: "center",
        },
        iconContainer: {
            display: "flex",
            alignItems: "baseline",
            justifyContent: "center",
            padding: 10,
        },
        passwordReset: {
            cursor: "pointer",
            textDecoration: "underline",
            "&:hover": {
                color: theme.palette.primary.main,
                cursor: "pointer",
            },
        },
        passwordInfo: {
            display: "flex",
            justifyContent: "space-between",
        },
        loginButton: {
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 30,
            paddingRight: 30,
            marginTop: 15,
        },
        avatarHeader: {
            display: "flex",
            alignItems: "center",
            width: 552,
        },
        subTitle: {
            fontSize: 14,
            fontWeight: 400,
        },
        title: {
            fontSize: "1.25rem",
            lineHeight: 1.1,
        },
        paper: {
            width: "100%",
        },
        content: {
            padding: "2px 24px 24px 24px",
            height: 300,
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 300,
            display: "flex",
        },
        info: {
            marginLeft: 10,
            height: 43,
            lineHeight: "43px",
        },
        dialogTitiel: {
            borderBottomStyle: "solid",
            borderBottomColor: theme.palette.getContrastText(
                theme.palette.background.default
            ),
            borderBottomWidth: 1,
            height: 32,
        },
        dialog: {
            padding: "16px 24px 10px 24px",
        },
        extendedIcon: {
            marginRight: theme.spacing(1),
        },
        input: {
            width: 280,
            color: theme.palette.getContrastText(
                theme.palette.background.default
            ),
        },
        saveArea: {
            paddingTop: 50,
            display: "flex",
            justifyContent: "flex-end",
        },
    })
);

export default function Login(props: LoginProps) {
    const { t } = useTranslation();
    const classes = useStyles();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [isPasswordResetOpen, setIsPasswordResetOpen] =
        useState<boolean>(false);
    const [passwordResettedMailSend, setPasswordResettedMailSend] =
        useState<boolean>(false);
    const [validationFailures, setValidationFailures] =
        useState<List<ValidationFailure> | null>(null);

    const onChangeMail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const onLogin = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        event.stopPropagation();
        event.preventDefault();
        login();
    };

    const login = () => {
        setValidationFailures(null);
        authenticationService.login(email, password).then((res) => {
            if (!!(res as AuthenticationUser).ident) history.push("/dashboard");
            else
                setValidationFailures(
                    (res as RequestResult).validationFailures
                );
        });
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.keyCode === ENTER_KEY) {
            login();
        }
    };

    const closePasswordReset = () => {
        setIsPasswordResetOpen(false);
    };

    const openPasswordReset = () => {
        setIsPasswordResetOpen(true);
    };

    const resetPassword = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        event.preventDefault();
        authenticationService.sendPasswordReset(email).then((res) => {
            if (!res?.validationFailures) {
                setPasswordResettedMailSend(true);
            } else
                setValidationFailures(
                    (res as RequestResult).validationFailures
                );
        });
    };

    return (
        <div className={classes.container}>
            <div className={classes.innerContainer}>
                <div className={classes.iconContainer}>
                    <div style={{ width: 100, display: "inline-block" }}>
                        <Icon style={{ height: 70, width: 70 }} />
                    </div>
                </div>
                <div style={{ padding: 5, paddingTop: 40 }}>
                    <TextField
                        InputProps={{
                            classes: {
                                input: classes.input,
                            },
                        }}
                        label={t("common.mailAddress")}
                        variant="outlined"
                        onChange={onChangeMail}
                    />
                </div>
                <div style={{ padding: 5 }}>
                    <TextField
                        InputProps={{
                            classes: {
                                input: classes.input,
                            },
                        }}
                        label={t("common.password")}
                        variant="outlined"
                        type="password"
                        onChange={onChangePassword}
                        error={validationFailures?.some(
                            (failure: ValidationFailure) =>
                                failure.propertyName === "Password"
                        )}
                        onKeyDown={handleKeyDown}
                        helperText={t(
                            validationFailures?.find(
                                (failure: ValidationFailure) =>
                                    failure.propertyName === "Password"
                            )?.errorMessage ?? ""
                        )}
                    />
                    <span>
                        {!!validationFailures?.find(
                            (failure: ValidationFailure) =>
                                failure.propertyName === "Password"
                        ) ? (
                            <div
                                className={classes.passwordReset}
                                onClick={openPasswordReset}
                            >
                                {t("common.passwordReset")}
                            </div>
                        ) : (
                            ""
                        )}
                    </span>
                </div>
                <Button
                    onClick={onLogin}
                    variant="contained"
                    color="primary"
                    size="medium"
                    className={classes.loginButton}
                    endIcon={<SendIcon />}
                >
                    {t("common.toLogin")}
                </Button>
                <div style={{ marginBottom: -35 }}>
                    <LawFooter />
                </div>
            </div>
            <Dialog
                fullScreen={fullScreen}
                open={isPasswordResetOpen}
                onClose={closePasswordReset}
                aria-labelledby="form-dialog-title"
                className={classes.dialog}
            >
                <DialogTitle id="form-dialog-title">
                    <div className={classes.avatarHeader}>
                        {t("passwordReset.title")}
                    </div>
                </DialogTitle>
                <DialogContent className={classes.content}>
                    <DialogContentText>
                        <p>{t("passwordReset.message", { login: email })}</p>
                        <p>
                            {t("passwordReset.messageLong", {
                                applicationNam: t("application.name"),
                            })}
                        </p>
                        <p>{t("passwordReset.messageDuration")}</p>
                    </DialogContentText>
                    {passwordResettedMailSend && (
                        <Alert severity="success">
                            {t("helpMessage.passwordResetSent")}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closePasswordReset} color="primary">
                        {t("common.cancelLabel")}
                    </Button>
                    <Button onClick={resetPassword} color="primary">
                        {t("common.reset")}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
