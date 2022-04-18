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
import { User } from "../../../types/user";

enum ColumnId {
    firstName = "firstName",
    lastName = "lastName",
    userName = "userName",
    role = "role",
}

interface Row {
    firstName: string;
    lastName: string;
    userName: string;
    role: string;
    data: any;
}

function createData(User: User): Row {
    const firstName = User.firstName;
    const lastName = User.lastName;
    const userName = User.userName;
    const role = User?.role?.name;
    const data = User;
    return { firstName, lastName, userName, role, data };
}

interface Props {
    onRowClick: (data: any) => void;
    onDeleteClick: (data: any) => void;
    refreshCount: number;
}

interface UserSearchOptions extends TableSearch {
    firstName?: string;
    lastName?: string;
    userName?: string;
    role?: string;
    sortColumn?: string;
    isDescending?: boolean;
    skip: number;
    take: number;
}

export default function UserTable({
    onRowClick,
    onDeleteClick,
    refreshCount,
}: Props) {
    const currentUser = authenticationService.currentUserValue;
    const canEdit =
        currentUser?.rights?.some(
            (x) => x === Rights.ADMINISTRATION_USERS_EDIT
        ) ?? false;
    const canDelete =
        currentUser?.rights?.some(
            (x) => x === Rights.ADMINISTRATION_USERS_DELETE
        ) ?? false;
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [data, setData] = useState<List<User> | null>(null);
    const [totalRowCount, setTotalRowCount] = useState<number>(0);
    const [searchOptions, setSearchOptions] = useState<UserSearchOptions>({
        sortColumn: ColumnId.firstName,
        isDescending: false,
        skip: 0,
        take: 25,
    } as UserSearchOptions);

    const onChangeFirstName = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        event.stopPropagation();
        event.preventDefault();
        const value = event.target.value;
        setSearchOptions({
            ...searchOptions,
            firstName:
                !value || 0 === value.length ? undefined : event.target.value,
        });
    };

    const onChangeLastName = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        event.stopPropagation();
        event.preventDefault();
        const value = event.target.value;
        setSearchOptions({
            ...searchOptions,
            lastName:
                !value || 0 === value.length ? undefined : event.target.value,
        });
    };

    const onChangeUserName = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        event.stopPropagation();
        event.preventDefault();
        const value = event.target.value;
        setSearchOptions({
            ...searchOptions,
            userName:
                !value || 0 === value.length ? undefined : event.target.value,
        });
    };

    const onChangeRole = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        event.stopPropagation();
        event.preventDefault();
        const value = event.target.value;
        setSearchOptions({
            ...searchOptions,
            role: !value || 0 === value.length ? undefined : event.target.value,
        });
    };

    useEffect(() => {
        setIsLoading(true);
        requestService
            .post<{ data: List<User>; totalRowCount: number }>(
                `/user/findBySearchValue`,
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
            lable: t("common.firstName"),
            id: ColumnId.firstName,
            element: (row, column) => {
                const value = row ? row[column.id] : null;
                return (
                    <TableCellCustom
                        column={column}
                        columnId={`${row?.data?.ident?.ident}_${ColumnId.firstName}`}
                    >
                        {value}
                    </TableCellCustom>
                );
            },
            onChangeSearchValue: onChangeFirstName,
        },
        {
            lable: t("common.lastName"),
            id: ColumnId.lastName,
            element: (row, column) => {
                const value = row ? row[column.id] : null;
                return (
                    <TableCellCustom
                        column={column}
                        columnId={`${row?.data?.ident?.ident}_${ColumnId.lastName}`}
                    >
                        {value}
                    </TableCellCustom>
                );
            },
            onChangeSearchValue: onChangeLastName,
        },
        {
            lable: t("common.mailAddress"),
            id: ColumnId.userName,
            element: (row, column) => {
                const value = row ? row[column.id] : null;
                return (
                    <TableCellCustom
                        column={column}
                        columnId={`${row?.data?.ident?.ident}_${ColumnId.userName}`}
                    >
                        {value}
                    </TableCellCustom>
                );
            },
            onChangeSearchValue: onChangeUserName,
        },
        {
            lable: t("common.role"),
            id: ColumnId.role,
            element: (row, column) => {
                const value = row ? row[column.id] : null;
                return (
                    <TableCellCustom
                        column={column}
                        columnId={`${row?.data?.ident?.ident}_${ColumnId.role}`}
                    >
                        {value}
                    </TableCellCustom>
                );
            },
            onChangeSearchValue: onChangeRole,
        },
    ];

    return (
        <StickyHeadTable
            canDelete={canDelete}
            canEdit={canEdit}
            key="userTable"
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
