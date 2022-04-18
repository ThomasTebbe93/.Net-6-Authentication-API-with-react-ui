import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Skeleton from "@material-ui/lab/Skeleton";
import { List } from "immutable";
import { RowAction, TableColumn } from "../tables/Table";
import { range } from "../../helpers/range";
import { TableCellCustom } from "../tables/TableCellCustom";
import TableBody from "@material-ui/core/TableBody";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        rowAction: {
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
        },
    })
);

interface Props {
    rowNumber: number;
    columns: TableColumn[];
    canEdit: boolean;
    canDelete: boolean;
    extraActions?: List<RowAction>;
}

export default function TableSkeleton({
    columns,
    canEdit,
    canDelete,
    extraActions,
    rowNumber,
}: Props) {
    const classes = useStyles();
    const rows = range(1, rowNumber);

    return (
        <TableBody>
            {rows.map((key: number) => (
                <TableRow key={`row_${key}`} hover tabIndex={-1}>
                    {columns.map((column) => (
                        <TableCellCustom
                            column={column}
                            columnId={column.id}
                            key={`row_${key}_${column.id}`}
                        >
                            <Skeleton
                                animation="wave"
                                key={column.id}
                                width={`${Math.random() * 100}%`}
                            />
                        </TableCellCustom>
                    ))}
                    {extraActions?.map((rowAction: RowAction) => (
                        <TableCell
                            key={`row_${key}_${rowAction.key}`}
                            align="center"
                            style={{ padding: 5 }}
                        >
                            <div className={classes.rowAction}>
                                <Skeleton animation="wave" />
                            </div>
                        </TableCell>
                    ))}
                    {canEdit && (
                        <TableCell
                            key={`row_${key}_edit`}
                            align="center"
                            style={{
                                padding: 5,
                                width: 38,
                            }}
                        >
                            <div className={classes.rowAction}>
                                <Skeleton
                                    animation="wave"
                                    width={20}
                                    height={20}
                                />
                            </div>
                        </TableCell>
                    )}
                    {canDelete && (
                        <TableCell
                            key={`row_${key}_delete`}
                            align="center"
                            style={{
                                padding: 5,
                                width: 38,
                            }}
                        >
                            <div className={classes.rowAction}>
                                <Skeleton
                                    animation="wave"
                                    width={20}
                                    height={20}
                                />
                            </div>
                        </TableCell>
                    )}
                </TableRow>
            ))}
        </TableBody>
    );
}
