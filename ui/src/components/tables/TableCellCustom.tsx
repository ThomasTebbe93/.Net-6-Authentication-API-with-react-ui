import { useTheme } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";

import { TableColumn } from "./Table";

interface Props {
    column: TableColumn;
    columnId: string;
    children: any;
    minWidth?: number;
    className?: string;
}

export function TableCellCustom({
    column,
    columnId,
    children,
    className,
}: Props): React.ReactElement {
    const theme = useTheme();
    return (
        <TableCell
            key={columnId}
            style={{
                minWidth: column.minWidth ?? 50,
                maxWidth: column.maxWidth ?? 400,
                width: column.width,
                padding: 5,
                color: theme.palette.getContrastText(
                    theme.palette.background.paper
                ),
            }}
            className={className}
        >
            <div
                style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    height: 20,
                }}
            >
                {children}
            </div>
        </TableCell>
    );
}
