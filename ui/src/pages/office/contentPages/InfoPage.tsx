import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import Page from "../../../components/layout/Page";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: "flex",
            flexWrap: "wrap",
            overflowX: "hidden",
            justifyContent: "center",
            alignItems: "space-between",
        },
    })
);

export default function InfoPage() {
    const { t } = useTranslation();
    const classes = useStyles();

    return (
        <Page title={t("common.info")}>
            <div className={classes.root}></div>
        </Page>
    );
}
