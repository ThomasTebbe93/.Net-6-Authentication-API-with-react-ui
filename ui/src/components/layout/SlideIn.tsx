import React, { useEffect, useState } from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";

interface Props {
    children: React.ReactNode;
    slideInIsOpen: boolean;
    onCloseSlidein: () => void;
}

export default function SlideIn(props: Props) {
    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            slidein: {
                backgroundColor: theme.palette.background.paper,
                position: "absolute",
                top: 0,
                bottom: 0,
                right: 0,
                transition: "width 300ms",
                overflowX: "hidden",
                OverflowY: "scroll",
            },
            slideinContend: {
                display: props.slideInIsOpen ? "block" : "none",
                color: theme.palette.getContrastText(
                    theme.palette.background.default
                ),
            },
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
                display: "flex",
            },
            overLay: {
                zIndex: 1000,
                position: "fixed",
                top: 0,
                bottom: 0,
                width: props.slideInIsOpen ? "100%" : 0,
                right: 0,
                backgroundColor: "#444444bf",
                transition: "width 300ms",
            },
            extendedIcon: {
                marginRight: theme.spacing(1),
            },
        })
    );
    const classes = useStyles(props.slideInIsOpen);

    const onCloseSlideIn = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        props.onCloseSlidein();
    };
    const onSlideInClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.stopPropagation();
        event.preventDefault();
    };

    const [windowSize, setWindowSize] = useState<{
        width: any;
        height: any;
    }>({
        width: undefined,
        height: undefined,
    });

    useEffect(() => {
        // Handler to call on window resize
        function handleResize() {
            // Set window width/height to state
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        // Add event listener
        window.addEventListener("resize", handleResize);

        // Call handler right away so state gets updated with initial window size
        handleResize();

        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
            <div className={classes.overLay} onClick={onCloseSlideIn}>
                <div
                    className={classes.slidein}
                    onClick={onSlideInClick}
                    style={{
                        width: props.slideInIsOpen
                            ? windowSize.width > 900
                                ? 900
                                : windowSize.width
                            : 0,
                    }}
                >
                    <div
                        className={classes.slideinContend}
                        style={{
                            display: props.slideInIsOpen ? "block" : "none",
                        }}
                    >
                        {props.slideInIsOpen && props.children}
                    </div>
                </div>
            </div>
        </>
    );
}
