import { makeStyles, createStyles, Theme } from "@material-ui/core";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            marginTop: 50,
            display: "flex",
            justifyContent: "space-evenly",
        },
        link: {
            fontSize: 12,
            textDecoration: "none",
            color: theme.palette.getContrastText(
                theme.palette.background.default
            ),
            "&:hover": {
                color: theme.palette.primary.main,
            },
        },
    })
);

export default function LawFooter() {
    const { t } = useTranslation();
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <a
                className={classes.link}
                href="https://<PRIVACY_POLICY>"
                target="_blank"
                rel="noopener noreferrer"
            >
                <span>{t("common.dataProtection")}</span>
            </a>
            <a
                className={classes.link}
                href="https://<IMPRINT>"
                target="_blank"
                rel="noopener noreferrer"
            >
                <span>{t("common.imprint")}</span>
            </a>
        </div>
    );
}
