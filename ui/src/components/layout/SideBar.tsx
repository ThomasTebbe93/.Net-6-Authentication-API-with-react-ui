import React, { useEffect, useState } from "react";
import {
    makeStyles,
    Theme,
    createStyles,
    useTheme,
} from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ViewModuleIcon from "@material-ui/icons/ViewModule";
import SecurityIcon from "@material-ui/icons/Security";
import PeopleOutlineIcon from "@material-ui/icons/PeopleOutline";
import SettingsIcon from "@material-ui/icons/Settings";
import VpnKey from "@material-ui/icons/VpnKey";
import { Description } from "@material-ui/icons";
import { useHistory } from "react-router";
import { useTranslation } from "react-i18next";
import { Collapse } from "@material-ui/core";
import { authenticationService } from "../../services/authenticationService";
import { Rights } from "../../helpers/rights";

interface SideBarProps {
    isSidebarCollaped: boolean;
    changeSidebarCollaption: () => void;
    useMobile: boolean;
}

const getStyle = (isSidebarCollaped: boolean, useMobile: boolean) =>
    makeStyles((theme: Theme) =>
        createStyles({
            rootStyle: {
                backgroundColor: theme.palette.background.default,
                zIndex: 1000,
                border: 0,
                position: "absolute",
                top: useMobile ? 40 : 56,
                bottom: 14,
                left: 0,
                overflowY: "scroll",
                width: isSidebarCollaped ? 32 : 250,
                overflow: "hidden",
                transition: "width 300ms",
                scrollbarWidth: "none",
            },
            versionCode: {
                backgroundColor: theme.palette.background.default,
                height: 15,
                fontSize: 10,
                zIndex: 1000,
                border: 0,
                position: "absolute",
                bottom: 0,
                left: 0,
                overflowY: "scroll",
                width: isSidebarCollaped ? 32 : 250,
                overflow: "hidden",
                transition: "width 300ms",
                scrollbarWidth: "none",
            },
            versionCodeSpan: {
                paddingLeft: isSidebarCollaped ? 4 : 18,
                color: theme.palette.getContrastText(
                    theme.palette.background.paper
                ),
                transition: "padding 300ms",
            },
            listItem: {
                paddingLeft: isSidebarCollaped ? 4 : 16,
                transition: "padding 300ms",
                whiteSpace: "nowrap",
            },
            nested: {
                paddingLeft: isSidebarCollaped ? 24 : 28,
                transition: "padding 300ms",
            },
            overLay: {
                zIndex: useMobile ? 1000 : 0,
                position: "fixed",
                top: 0,
                bottom: 0,
                left: 0,
                width: isSidebarCollaped ? 32 : useMobile ? "100%" : 0,
                transition: "zIndex 300ms",
            },
        })
    );

export default function SideBar({
    isSidebarCollaped,
    changeSidebarCollaption,
    useMobile,
}: SideBarProps) {
    const { t } = useTranslation();
    const history = useHistory();
    const theme = useTheme();
    const useStyles = getStyle(isSidebarCollaped, useMobile);
    const classes = useStyles();
    const currentUser = authenticationService.currentUserValue;

    const [selectedIndex, setSelectedIndex] = useState(
        history.location.pathname
    );

    useEffect(() => {
        setSelectedIndex(history.location.pathname);
    }, [history.location.pathname]);

    const handleCollaps = () => {
        if (isSidebarCollaped) changeSidebarCollaption();
    };

    const goTo = (event: any, newIndex: string) => {
        event.stopPropagation();
        event.preventDefault();
        handleCollaps();
        history.push(newIndex);
    };

    const onCloseSlideIn = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.stopPropagation();
        event.preventDefault();
        if (useMobile) changeSidebarCollaption();
    };

    const isSelected = (url: string) =>
        selectedIndex === url || selectedIndex.includes(url);

    return (
        <div className={classes.overLay} onClick={onCloseSlideIn}>
            <div className={classes.rootStyle}>
                <List component="nav">
                    <ListItem
                        className={classes.listItem}
                        style={{
                            color: isSelected("/dashboard")
                                ? theme.palette.primary.main
                                : theme.palette.getContrastText(
                                      theme.palette.background.paper
                                  ),
                        }}
                        button
                        selected={isSelected("/dashboard")}
                        onClick={(event) => goTo(event, "/dashboard")}
                    >
                        <ListItemIcon>
                            <ViewModuleIcon
                                htmlColor={
                                    isSelected("/dashboard")
                                        ? theme.palette.primary.main
                                        : theme.palette.getContrastText(
                                              theme.palette.background.paper
                                          )
                                }
                            />
                        </ListItemIcon>
                        <ListItemText primary={t("common.dashboard")} />
                    </ListItem>
                    <ListItem
                        className={classes.listItem}
                        style={{
                            color: isSelected("/info")
                                ? theme.palette.primary.main
                                : theme.palette.getContrastText(
                                      theme.palette.background.paper
                                  ),
                        }}
                        button
                        selected={isSelected("/info")}
                        onClick={(event) => goTo(event, "/info")}
                    >
                        <ListItemIcon>
                            <ViewModuleIcon
                                htmlColor={
                                    isSelected("/info")
                                        ? theme.palette.primary.main
                                        : theme.palette.getContrastText(
                                              theme.palette.background.paper
                                          )
                                }
                            />
                        </ListItemIcon>
                        <ListItemText primary={t("common.info")} />
                    </ListItem>
                    {currentUser?.rights?.some(
                        (x) => x === Rights.ADMINISTRATION
                    ) && (
                        <ListItem
                            style={{
                                color: isSelected("/administration")
                                    ? theme.palette.primary.main
                                    : theme.palette.getContrastText(
                                          theme.palette.background.paper
                                      ),
                            }}
                            className={classes.listItem}
                            button
                            selected={selectedIndex === "/administration"}
                            onClick={(event) => goTo(event, "/administration")}
                        >
                            <ListItemIcon>
                                <SecurityIcon
                                    htmlColor={
                                        isSelected("/administration")
                                            ? theme.palette.primary.main
                                            : theme.palette.getContrastText(
                                                  theme.palette.background.paper
                                              )
                                    }
                                />
                            </ListItemIcon>
                            <ListItemText
                                primary={t("common.administration")}
                            />
                        </ListItem>
                    )}
                    {!isSidebarCollaped &&
                        currentUser?.rights?.some(
                            (x) => x === Rights.ADMINISTRATION
                        ) && (
                            <Collapse
                                in={selectedIndex?.includes("/administration")}
                                timeout="auto"
                                unmountOnExit
                            >
                                <List component="div" disablePadding>
                                    {currentUser?.rights?.some(
                                        (x) => x === Rights.ADMINISTRATION_USERS
                                    ) && (
                                        <ListItem
                                            style={{
                                                color: isSelected(
                                                    "/administration/users"
                                                )
                                                    ? theme.palette.primary.main
                                                    : theme.palette.getContrastText(
                                                          theme.palette
                                                              .background.paper
                                                      ),
                                            }}
                                            button
                                            className={classes.nested}
                                            selected={selectedIndex?.includes(
                                                "/administration/users"
                                            )}
                                            onClick={(event) =>
                                                goTo(
                                                    event,
                                                    "/administration/users"
                                                )
                                            }
                                        >
                                            <ListItemIcon>
                                                <PeopleOutlineIcon
                                                    htmlColor={
                                                        isSelected(
                                                            "/administration/users"
                                                        )
                                                            ? theme.palette
                                                                  .primary.main
                                                            : theme.palette.getContrastText(
                                                                  theme.palette
                                                                      .background
                                                                      .paper
                                                              )
                                                    }
                                                />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={t("common.users")}
                                            />
                                        </ListItem>
                                    )}
                                    {currentUser?.rights?.some(
                                        (x) => x === Rights.ADMINISTRATION_ROLES
                                    ) && (
                                        <ListItem
                                            style={{
                                                color: isSelected(
                                                    "/administration/roles"
                                                )
                                                    ? theme.palette.primary.main
                                                    : theme.palette.getContrastText(
                                                          theme.palette
                                                              .background.paper
                                                      ),
                                            }}
                                            button
                                            className={classes.nested}
                                            selected={selectedIndex?.includes(
                                                "/administration/roles"
                                            )}
                                            onClick={(event) =>
                                                goTo(
                                                    event,
                                                    "/administration/roles"
                                                )
                                            }
                                        >
                                            <ListItemIcon>
                                                <VpnKey
                                                    htmlColor={
                                                        isSelected(
                                                            "/administration/roles"
                                                        )
                                                            ? theme.palette
                                                                  .primary.main
                                                            : theme.palette.getContrastText(
                                                                  theme.palette
                                                                      .background
                                                                      .paper
                                                              )
                                                    }
                                                />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={t("common.roles")}
                                            />
                                        </ListItem>
                                    )}
                                    {currentUser?.rights?.some(
                                        (x) =>
                                            x === Rights.ADMINISTRATION_SETTINGS
                                    ) && (
                                        <ListItem
                                            button
                                            style={{
                                                color: isSelected(
                                                    "/administration/settings"
                                                )
                                                    ? theme.palette.primary.main
                                                    : theme.palette.getContrastText(
                                                          theme.palette
                                                              .background.paper
                                                      ),
                                            }}
                                            className={classes.nested}
                                            selected={selectedIndex?.includes(
                                                "/administration/settings"
                                            )}
                                            onClick={(event) =>
                                                goTo(
                                                    event,
                                                    "/administration/settings"
                                                )
                                            }
                                        >
                                            <ListItemIcon>
                                                <SettingsIcon
                                                    htmlColor={
                                                        isSelected(
                                                            "/administration/settings"
                                                        )
                                                            ? theme.palette
                                                                  .primary.main
                                                            : theme.palette.getContrastText(
                                                                  theme.palette
                                                                      .background
                                                                      .paper
                                                              )
                                                    }
                                                />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={t("common.settings")}
                                            />
                                        </ListItem>
                                    )}

                                    {currentUser?.rights?.some(
                                        (x) => x === Rights.ADMINISTRATION_FILES
                                    ) && (
                                        <ListItem
                                            button
                                            style={{
                                                color: isSelected(
                                                    "/administration/files"
                                                )
                                                    ? theme.palette.primary.main
                                                    : theme.palette.getContrastText(
                                                          theme.palette
                                                              .background.paper
                                                      ),
                                            }}
                                            className={classes.nested}
                                            selected={selectedIndex?.includes(
                                                "/administration/files"
                                            )}
                                            onClick={(event) =>
                                                goTo(
                                                    event,
                                                    "/administration/files"
                                                )
                                            }
                                        >
                                            <ListItemIcon>
                                                <Description
                                                    htmlColor={
                                                        isSelected(
                                                            "/administration/files"
                                                        )
                                                            ? theme.palette
                                                                  .primary.main
                                                            : theme.palette.getContrastText(
                                                                  theme.palette
                                                                      .background
                                                                      .paper
                                                              )
                                                    }
                                                />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={t("common.files")}
                                            />
                                        </ListItem>
                                    )}
                                </List>
                            </Collapse>
                        )}
                </List>
            </div>

            <div className={classes.versionCode}>
                <div className={classes.versionCodeSpan}>2.0.6</div>
            </div>
        </div>
    );
}
