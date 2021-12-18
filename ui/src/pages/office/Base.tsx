import { useEffect, useState } from "react";
import PrivateRoute from "../../components/PrivateRoute";
import Dashboard from "./contentPages/Dashboard";
import InfoPage from "./contentPages/InfoPage";
import MenuAppBar from "../../components/layout/MenuAppBar";
import SideBar from "../../components/layout/SideBar";
import FilePage from "./files/FilePage";
import UserPage from "./memberchip/UserPage";
import RolePage from "./roleRights/RolePage";
import {
    makeStyles,
    Theme,
    createStyles,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import { Rights } from "../../helpers/rights";

export default function Base() {
    const theme = useTheme();
    const useMobile = useMediaQuery(theme.breakpoints.down("sm")) ?? true;
    const [isSidebarCollaped, setIsSidebarCollaped] =
        useState<boolean>(useMobile);
    const changeCollaption = () => setIsSidebarCollaped(!isSidebarCollaped);

    useEffect(() => {
        setIsSidebarCollaped(useMobile);
    }, [useMobile]);

    const useStyles = (useMobile: boolean) =>
        makeStyles((theme: Theme) =>
            createStyles({
                section: {
                    border: 0,
                    position: "absolute",
                    backgroundColor: theme.palette.background.default,
                    color: theme.palette.getContrastText(
                        theme.palette.background.default
                    ),
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    overflow: "hidden",
                    marginLeft: isSidebarCollaped || useMobile ? 32 : 250,
                    marginTop: useMobile ? 40 : 56,
                    transition: "margin-left 300ms",
                },
                "@global": {
                    "*::-webkit-scrollbar": {
                        width: "0em",
                    },
                    "*::-webkit-scrollbar-track": {
                        "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
                    },
                    "*::-webkit-scrollbar-thumb": {
                        backgroundColor: "rgba(0,0,0,.1)",
                    },
                },
            })
        )();
    const classes = useStyles(useMobile);
    return (
        <div style={{ height: "100%" }}>
            <MenuAppBar
                useMobile={useMobile}
                changeSidebarCollaption={changeCollaption}
                isSidebarCollaped={isSidebarCollaped}
            />
            <SideBar
                isSidebarCollaped={isSidebarCollaped}
                changeSidebarCollaption={changeCollaption}
                useMobile={useMobile}
            />
            <div className={classes.section}>
                <PrivateRoute
                    key="/dashboard"
                    path="/dashboard"
                    component={Dashboard}
                />
                <PrivateRoute key="/info" path="/info" component={InfoPage} />
                <PrivateRoute
                    key="/administration/users"
                    path="/administration/users"
                    component={UserPage}
                    right={Rights.ADMINISTRATION_USERS}
                />
                <PrivateRoute
                    key="/administration/roles"
                    path="/administration/roles"
                    component={RolePage}
                    right={Rights.ADMINISTRATION_ROLES}
                />
                <PrivateRoute
                    key="/administration/settings"
                    path="/administration/settings"
                    component={InfoPage}
                    right={Rights.ADMINISTRATION_SETTINGS}
                />
                <PrivateRoute
                    key="/administration/files"
                    path="/administration/files"
                    component={FilePage}
                    right={Rights.ADMINISTRATION_FILES}
                />
            </div>
        </div>
    );
}
