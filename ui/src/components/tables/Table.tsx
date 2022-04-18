import React, { useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { FormControl, Input, useTheme } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { List } from "immutable";
import { useTranslation } from "react-i18next";
import TableSkeleton from "../loadingAnimations/TableSkeleton";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: "100%",
            height: "100%",
            color: theme.palette.getContrastText(
                theme.palette.background.paper
            ),
        },
        warning: {
            color: theme.palette.secondary.main,
        },
        rowAction: {
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
        },
    })
);

interface Props {
    createData: (e: any) => any;
    onRowClick: (data: any) => void;
    onDeleteClick?: (data: any) => void;
    isLoading: boolean;
    data: any;
    totalRowCount: number;
    columns: TableColumn[];
    searchOptions: TableSearch;
    setSearchOptions: (options: TableSearch) => void;
    canEdit: boolean;
    canDelete: boolean;
    extraActions?: List<RowAction>;
}

export interface RowAction {
    key: string;
    icon: React.ReactNode;
    onClick: (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        data: any
    ) => void;
}

export interface TableColumn {
    notSortable?: boolean;
    lable: string;
    id: string;
    width?: number;
    minWidth?: number;
    maxWidth?: number;
    align?: "left";
    element: (row: any | null, column: TableColumn) => React.ReactNode;
    onChangeSearchValue?: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
}

export interface TableSearch {
    sortColumn?: string;
    isDescending?: boolean;
    skip: number;
    take: number;
}

export default function StickyHeadTable({
    onRowClick,
    onDeleteClick,
    createData,
    isLoading,
    data,
    totalRowCount,
    columns,
    searchOptions,
    setSearchOptions,
    canEdit,
    canDelete,
    extraActions,
}: Props) {
    const { t } = useTranslation();
    const [page, setPage] = useState<number>(0);
    const classes = useStyles();
    const theme = useTheme();
    const rows = data?.map((baseData: any) => createData(baseData));

    const rowClick = (event: React.MouseEvent<any>, data: any) => {
        event.stopPropagation();
        event.preventDefault();
        onRowClick(data);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSearchOptions({
            ...searchOptions,
            skip: +event.target.value * page,
            take: +event.target.value,
        });
        setPage(0);
    };

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
        newPage: number
    ) => {
        event?.stopPropagation();
        setPage(newPage);
        setSearchOptions({
            ...searchOptions,
            skip: searchOptions.take * newPage,
            take: searchOptions.take,
        });
    };

    const onChangeSortColumn = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        columnId: string
    ) => {
        event.stopPropagation();
        event.preventDefault();
        setPage(0);
        setSearchOptions({
            ...searchOptions,
            sortColumn: columnId,
            isDescending:
                searchOptions.sortColumn === columnId &&
                !searchOptions.isDescending,
        });
    };

    const onDelete = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        data: any
    ) => {
        event.preventDefault();
        event.stopPropagation();
        if (onDeleteClick) onDeleteClick(data);
    };

    return (
        <Paper className={classes.root} style={{ position: "relative" }}>
            <TableContainer>
                <Table aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column: TableColumn) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{
                                        minWidth: column.minWidth ?? 50,
                                        maxWidth: column.maxWidth ?? 400,
                                        width: column.width,
                                        padding: 5,
                                        verticalAlign: "baseline",
                                        color: theme.palette.getContrastText(
                                            theme.palette.background.paper
                                        ),
                                    }}
                                >
                                    <div
                                        onClick={
                                            column.notSortable
                                                ? () => {}
                                                : (
                                                      event: React.MouseEvent<
                                                          HTMLDivElement,
                                                          MouseEvent
                                                      >
                                                  ) =>
                                                      onChangeSortColumn(
                                                          event,
                                                          column.id
                                                      )
                                        }
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            backgroundColor:
                                                theme.palette.primary.light,
                                            padding: "3px 9px",
                                            fontSize: 16,
                                            cursor: column.notSortable
                                                ? ""
                                                : "pointer",
                                            height: 30,
                                            alignItems: "center",
                                            color: theme.palette.getContrastText(
                                                theme.palette.background.paper
                                            ),
                                        }}
                                    >
                                        {column.lable}
                                        {searchOptions.sortColumn ===
                                        column.id ? (
                                            searchOptions.isDescending ? (
                                                <ExpandMore
                                                    style={{
                                                        width: 25,
                                                        height: 25,
                                                    }}
                                                />
                                            ) : (
                                                <ExpandLess
                                                    style={{
                                                        width: 25,
                                                        height: 25,
                                                    }}
                                                />
                                            )
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                    {column.onChangeSearchValue && (
                                        <div>
                                            <FormControl
                                                style={{ width: "100%" }}
                                            >
                                                <Input
                                                    style={{
                                                        width: "100%",
                                                        minWidth:
                                                            column.minWidth,
                                                        color: theme.palette.getContrastText(
                                                            theme.palette
                                                                .background
                                                                .paper
                                                        ),
                                                    }}
                                                    onChange={
                                                        column.onChangeSearchValue
                                                    }
                                                />
                                            </FormControl>
                                        </div>
                                    )}
                                </TableCell>
                            ))}
                            {extraActions?.map(() => (
                                <TableCell
                                    align="center"
                                    style={{ minWidth: 10, width: 10 }}
                                ></TableCell>
                            ))}
                            {canEdit && (
                                <TableCell
                                    align="center"
                                    style={{ minWidth: 10, width: 10 }}
                                ></TableCell>
                            )}
                            {canDelete && (
                                <TableCell
                                    align="center"
                                    style={{ minWidth: 10, width: 10 }}
                                ></TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    {isLoading && (
                        <TableSkeleton
                            rowNumber={10}
                            columns={columns}
                            canEdit={canEdit}
                            canDelete={canDelete}
                            extraActions={extraActions}
                        />
                    )}
                    <TableBody>
                        {!isLoading &&
                            rows?.map((row: any) => {
                                return (
                                    <TableRow
                                        key={row?.data?.ident?.ident}
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        onClick={(
                                            event: React.MouseEvent<
                                                HTMLTableRowElement,
                                                MouseEvent
                                            >
                                        ) => rowClick(event, row.data)}
                                    >
                                        {columns.map((column) =>
                                            column.element(row, column)
                                        )}
                                        {extraActions?.map(
                                            (rowAction: RowAction) => (
                                                <TableCell
                                                    key={`${row?.data?.ident?.ident}_${rowAction.key}`}
                                                    align="center"
                                                    style={{ padding: 5 }}
                                                >
                                                    <div
                                                        className={
                                                            classes.rowAction
                                                        }
                                                        onClick={(
                                                            event: React.MouseEvent<
                                                                HTMLDivElement,
                                                                MouseEvent
                                                            >
                                                        ) =>
                                                            rowAction.onClick(
                                                                event,
                                                                row.data
                                                            )
                                                        }
                                                    >
                                                        {rowAction.icon}
                                                    </div>
                                                </TableCell>
                                            )
                                        )}
                                        {canEdit && (
                                            <TableCell
                                                key={`${row?.data?.ident?.ident}_edit`}
                                                align="center"
                                                style={{
                                                    padding: 5,
                                                    width: 38,
                                                }}
                                            >
                                                <div
                                                    className={
                                                        classes.rowAction
                                                    }
                                                    onClick={(
                                                        event: React.MouseEvent<
                                                            HTMLDivElement,
                                                            MouseEvent
                                                        >
                                                    ) =>
                                                        rowClick(
                                                            event,
                                                            row.data
                                                        )
                                                    }
                                                >
                                                    <EditIcon
                                                        style={{
                                                            width: 20,
                                                            height: 20,
                                                        }}
                                                    />
                                                </div>
                                            </TableCell>
                                        )}
                                        {canDelete && (
                                            <TableCell
                                                key={`${row?.data?.ident?.ident}_delete`}
                                                align="center"
                                                style={{
                                                    padding: 5,
                                                    width: 38,
                                                }}
                                            >
                                                <div
                                                    className={
                                                        classes.rowAction
                                                    }
                                                    onClick={(
                                                        event: React.MouseEvent<
                                                            HTMLDivElement,
                                                            MouseEvent
                                                        >
                                                    ) =>
                                                        onDelete(
                                                            event,
                                                            row.data
                                                        )
                                                    }
                                                >
                                                    <DeleteIcon
                                                        style={{
                                                            width: 20,
                                                            height: 20,
                                                        }}
                                                    />
                                                </div>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[25, 100, 250, 500]}
                count={totalRowCount}
                rowsPerPage={searchOptions.take}
                page={page}
                onPageChange={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                labelDisplayedRows={({ from, to, count }) =>
                    t("common.pagination", {
                        from: from,
                        to: to,
                        count: count,
                    })
                }
                backIconButtonText={t("common.previousPage")}
                nextIconButtonText={t("common.nextPage")}
                labelRowsPerPage={t("common.rowsPerPage")}
                style={{
                    color: theme.palette.getContrastText(
                        theme.palette.background.paper
                    ),
                }}
            />
        </Paper>
    );
}
