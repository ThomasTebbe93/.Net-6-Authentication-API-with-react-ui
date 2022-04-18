import { List } from "immutable";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TableCellCustom } from "../../../components/tables/TableCellCustom";
import StickyHeadTable, {
    TableColumn,
    TableSearch,
} from "../../../components/tables/Table";
import { Rights } from "../../../helpers/rights";
import { authenticationService } from "../../../services/authenticationService";
import { requestService } from "../../../services/requestService";
import { Role } from "../../../types/role";

enum ColumnId {
    name = "name",
    description = "description",
}

interface Row {
    name: string;
    description: string;
    data: any;
}

function createData(role: Role): Row {
    const name = role.name;
    const description = role.description;
    const data = role;
    return { name, description, data };
}

interface Props {
    onRowClick: (data: any) => void;
    onDeleteClick: (data: any) => void;
    refreshCount: number;
}

interface roleSearchOptions extends TableSearch {
    name?: string;
    description?: string;
    sortColumn?: string;
    isDescending?: boolean;
    skip: number;
    take: number;
}

export default function RoleTable({
    onRowClick,
    onDeleteClick,
    refreshCount,
}: Props) {
    const currentUser = authenticationService.currentUserValue;
    const canEdit =
        currentUser?.rights?.some(
            (x) => x === Rights.ADMINISTRATION_ROLES_EDIT
        ) ?? false;
    const canDelete =
        currentUser?.rights?.some(
            (x) => x === Rights.ADMINISTRATION_ROLES_DELETE
        ) ?? false;
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [data, setData] = useState<List<Role> | null>(null);
    const [totalRowCount, setTotalRowCount] = useState<number>(0);
    const [searchOptions, setSearchOptions] = useState<roleSearchOptions>({
        sortColumn: ColumnId.name,
        isDescending: false,
        skip: 0,
        take: 25,
    } as roleSearchOptions);

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

    const onChangeDescription = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        event.stopPropagation();
        event.preventDefault();
        const value = event.target.value;
        setSearchOptions({
            ...searchOptions,
            description:
                !value || 0 === value.length ? undefined : event.target.value,
        });
    };

    useEffect(() => {
        setIsLoading(true);
        requestService
            .post<{ data: List<Role>; totalRowCount: number }>(
                `/role/findBySearchValue`,
                searchOptions
            )
            .then((res) => {
                setData(res.data);
                setTotalRowCount(res.totalRowCount);
                setIsLoading(false);
            });
    }, [searchOptions, refreshCount]);

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
            lable: t("common.description"),
            id: ColumnId.description,
            element: (row, column) => {
                const value = row ? row[column.id] : null;
                return (
                    <TableCellCustom
                        column={column}
                        columnId={`${row?.data?.ident?.ident}_${ColumnId.description}`}
                    >
                        {value}
                    </TableCellCustom>
                );
            },
            onChangeSearchValue: onChangeDescription,
        },
    ];

    return (
        <StickyHeadTable
            canDelete={canDelete}
            canEdit={canEdit}
            onDeleteClick={onDeleteClick}
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
