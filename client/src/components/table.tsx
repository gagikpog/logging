import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import LongMenu, { IMenuOptions } from "./longMenu";

type TItem = { id: string | number }

export interface IColumn<TData extends TItem = TItem> {
  field: keyof TData;
  headerName: string;
}

export interface IAction extends IMenuOptions {

}

interface ITableProps<TData extends TItem = TItem> {
  rows: TData[];
  columns: IColumn<TData>[];
  actions?: IAction[];
  onExecuteAction?(item: TData, action: IAction): void;
}

export default function BasicTable<TData extends TItem = TItem>({ rows, columns, actions, onExecuteAction }: ITableProps<TData>) {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {columns.map((column) => {
                        return (
                            <TableCell key={column.field as string}>
                                {column.headerName}
                            </TableCell>
                        );
                        })}
                        {actions?.length ? <TableCell key="_actions" width={40}><div></div></TableCell>: null}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.id}
                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                        >
                            {columns.map((column) => {
                                return (
                                    <TableCell key={column.field as string}>
                                        {row[column.field] as string}
                                    </TableCell>
                                );
                            })}
                            {
                                actions?.length ? <TableCell key="_actions" width={40}>
                                    <LongMenu options={actions} onSelect={(action) => {onExecuteAction?.(row, action)}}/>
                                </TableCell>: null
                            }
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
