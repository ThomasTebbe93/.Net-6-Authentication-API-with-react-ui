import React, { Context, useContext, useState } from "react";
import {
    createStyles,
    makeStyles,
    Theme,
    useTheme,
} from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Avatar from "@material-ui/core/Avatar/Avatar";
import { authenticationService } from "../../services/authenticationService";
import { ReactComponent as Icon } from "../../images/logo/logo.svg";
import { useTranslation } from "react-i18next";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            color: theme.palette.getContrastText(
                theme.palette.background.default
            ),
        },
        headerWeb: {
            backgroundColor: theme.palette.background.paper,
        },
        headerMobile: {
            backgroundColor: theme.palette.background.paper,
            minHeight: 40,
        },
        menuButtonWeb: {
            marginRight: theme.spacing(2),
            height: 48,
            width: 48,
        },
        menuItem: {
            color: theme.palette.getContrastText(
                theme.palette.background.paper
            ),
        },
        menuButtonMobile: {
            marginRight: theme.spacing(2),
            height: 24,
            width: 24,
        },
        iconMobile: {
            height: 15,
            width: 15,
        },
        iconWeb: {
            height: 24,
            width: 24,
        },
        titleWeb: {
            fontSize: 25,
            flexGrow: 1,
            textAlign: "initial",
            alignSelf: "flex-end",
            marginBottom: 8.7,
            fontWeight: 600,
        },
        titleMobil: {
            fontSize: 15,
            flexGrow: 1,
            textAlign: "initial",
            alignSelf: "center",
            marginBottom: -7.6,
            fontWeight: 600,
        },
        avatarWeb: {
            color: theme.palette.getContrastText(theme.palette.secondary.main),
            backgroundColor: theme.palette.primary.main,
            fontSize: 20,
            fontWeight: 500,
        },
        avatarMobile: {
            color: theme.palette.getContrastText(theme.palette.secondary.main),
            backgroundColor: theme.palette.primary.main,
            fontSize: 10,
            fontWeight: 500,
            height: 24,
            width: 24,
        },
    })
);

interface MenuAppBarProps {
    changeSidebarCollaption: () => void;
    isSidebarCollaped: boolean;
    useMobile: boolean;
    colorModeContext: Context<{
        toggleColorMode: () => void;
    }>;
}

export default function MenuAppBar({
    changeSidebarCollaption,
    isSidebarCollaped,
    useMobile,
    colorModeContext,
}: MenuAppBarProps) {
    const { t } = useTranslation();
    const classes = useStyles();
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const currentUser = authenticationService.currentUserValue;

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const logout = () => {
        handleClose();
        authenticationService.logout();
    };

    const colorMode = useContext(colorModeContext);

    return (
        <div className={classes.root}>
            <AppBar
                position="static"
                className={useMobile ? classes.headerMobile : classes.headerWeb}
            >
                <Toolbar style={{ minHeight: useMobile ? 40 : 56 }}>
                    <IconButton
                        edge="start"
                        className={
                            useMobile
                                ? classes.menuButtonMobile
                                : classes.menuButtonWeb
                        }
                        color="inherit"
                        aria-label="menu"
                        onClick={changeSidebarCollaption}
                    >
                        {isSidebarCollaped ? (
                            <MenuIcon
                                className={
                                    useMobile
                                        ? classes.iconMobile
                                        : classes.iconWeb
                                }
                                htmlColor={theme.palette.getContrastText(
                                    theme.palette.background.paper
                                )}
                            />
                        ) : (
                            <MenuOpenIcon
                                className={
                                    useMobile
                                        ? classes.iconMobile
                                        : classes.iconWeb
                                }
                                htmlColor={theme.palette.getContrastText(
                                    theme.palette.background.paper
                                )}
                            />
                        )}
                    </IconButton>
                    <Icon
                        style={{
                            height: useMobile ? 20 : 25,
                            width: useMobile ? 20 : 25,
                            marginRight: useMobile ? 3 : 7,
                            marginLeft: useMobile ? 15 : 30,
                        }}
                    />
                    <div
                        className={
                            useMobile ? classes.titleMobil : classes.titleWeb
                        }
                    ></div>
                    <div>
                        <IconButton
                            className={
                                useMobile ? classes.iconMobile : classes.iconWeb
                            }
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <Avatar
                                className={
                                    useMobile
                                        ? classes.avatarMobile
                                        : classes.avatarWeb
                                }
                            >
                                {(currentUser?.firstName?.substring(0, 1) ??
                                    "") +
                                    (currentUser?.lastName?.substring(0, 1) ??
                                        "")}
                            </Avatar>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            open={open}
                            onClose={() => handleClose()}
                        >
                            <MenuItem
                                onClick={logout}
                                className={classes.menuItem}
                            >
                                {t("common.logout")}
                            </MenuItem>
                            <MenuItem
                                onClick={colorMode.toggleColorMode}
                                className={classes.menuItem}
                            >
                                {theme.palette.type === "dark" ? (
                                    <Brightness7Icon />
                                ) : (
                                    <Brightness4Icon />
                                )}
                            </MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
}
