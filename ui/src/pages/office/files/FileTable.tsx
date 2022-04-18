import { CloudDownload } from "@material-ui/icons";
import { format } from "date-fns";
import { List } from "immutable";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TableCellCustom } from "../../../components/tables/TableCellCustom";
import StickyHeadTable, {
    RowAction,
    TableColumn,
    TableSearch,
} from "../../../components/tables/Table";
import { requestService } from "../../../services/requestService";
import { File } from "../../../types/file";

enum ColumnId {
    name = "name",
    createTime = "createTime",
    size = "size",
    downloadPath = "downloadPath",
}

interface Row {
    name: string;
    size?: number;
    createTime?: Date;
    downloadPath?: string;
    data: any;
}

function createData(file: File): Row {
    const name = file.name;
    const size = file.size;
    const createTime = file.createTime;
    const downloadPath = file.downloadPath;
    const data = file;
    return { name, size, createTime, downloadPath, data };
}

interface Props {
    onRowClick: (data: any) => void;
    onDeleteClick: (data: any) => void;
    refreshCount: number;
}

interface FileSearchOptions extends TableSearch {
    name?: string;
    description?: string;
    licensePlate?: string;
    radioName?: string;
    sortColumn?: string;
    isDescending?: boolean;
    skip: number;
    take: number;
}

export default function FileTable({
    onRowClick,
    onDeleteClick,
    refreshCount,
}: Props) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [data, setData] = useState<List<File> | null>(null);
    const [totalRowCount, setTotalRowCount] = useState<number>(0);
    const [searchOptions, setSearchOptions] = useState<FileSearchOptions>({
        sortColumn: ColumnId.name,
        isDescending: true,
        skip: 0,
        take: 25,
    } as FileSearchOptions);

    const onChangeName = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        event.stopPropagation();
        event.preventDefault();
        const value = event.target.value;
        setSearchOptions({
            ...searchOptions,
            name: !value || 0 === value.length ? undefined : event.target.value,
        });
    };

    useEffect(() => {
        setIsLoading(true);
        requestService
            .post<{ data: List<File>; totalRowCount: number }>(
                `/file/findBySearchValueAndCreatorIdent`,
                searchOptions
            )
            .then((res) => {
                setData(res.data);
                setTotalRowCount(res.totalRowCount);
                setIsLoading(false);
            });
    }, [searchOptions, refreshCount]);

    const download = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        file: File
    ) => {
        event.stopPropagation();
        event.preventDefault();
        window.open(file.downloadPath, "_blank");
    };

    const fileSizeToString = (size: number) => {
        if (size < 1000)
            return `${size?.toLocaleString("de-DE", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
            })} Byte`;
        if (size >= 1000 && size < 1000000)
            return `${(size / 1000)?.toLocaleString("de-DE", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
            })} KB`;
        if (size >= 1000000 && size < 1000000000)
            return `${(size / 1000000)?.toLocaleString("de-DE", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
            })} MB`;
        if (size >= 1000000000)
            return `${(size / 1000000000)?.toLocaleString("de-DE", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
            })} GB`;
    };

    const columns: TableColumn[] = [
        {
            lable: t("common.name"),
            id: ColumnId.name,
            minWidth: 270,
            element: (row, column) => {
                const value = row ? row[column.id] : null;
                return (
                    <TableCellCustom
                        column={column}
                        columnId={`${row?.data?.ident?.ident}_${ColumnId.name}`}
                        minWidth={370}
                    >
                        {value}
                    </TableCellCustom>
                );
            },
            onChangeSearchValue: onChangeName,
        },
        {
            lable: t("common.size"),
            id: ColumnId.size,
            width: 120,
            element: (row, column) => {
                const value = row ? row[column.id] : null;
                return (
                    <TableCellCustom
                        column={column}
                        columnId={`${row?.data?.ident?.ident}_${ColumnId.size}`}
                    >
                        {fileSizeToString(value)}
                    </TableCellCustom>
                );
            },
        },
        {
            lable: t("common.date"),
            id: ColumnId.createTime,
            width: 120,
            element: (row, column) => {
                const value = row ? row[column.id] : null;
                return (
                    <TableCellCustom
                        column={column}
                        columnId={`${row?.data?.ident?.ident}_${ColumnId.createTime}`}
                    >
                        {value
                            ? format(new Date(value), "dd.MM.yyyy HH:mm")
                            : null}
                    </TableCellCustom>
                );
            },
        },
    ];

    const extraActions = List<RowAction>([
        {
            key: "download",
            icon: <CloudDownload style={{ width: 20, height: 20 }} />,
            onClick: (
                event: React.MouseEvent<HTMLDivElement, MouseEvent>,
                data: any
            ) => download(event, data),
        },
    ]);

    return (
        <StickyHeadTable
            extraActions={extraActions}
            canDelete={false} // noch nicht implementiert
            canEdit={false}
            //onDeleteClick={onDeleteClick} noch nicht implementiert
            createData={createData}
            onRowClick={onRowClick}
            isLoading={isLoading}
            data={data}
            totalRowCount={totalRowCount}
            columns={columns}
            searchOptions={searchOptions}
            setSearchOptions={setSearchOptions}
        />
    );
}
