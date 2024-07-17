// @mui
import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
} from '@mui/material';
// hooks
import useTable from '../../../../../hooks/useTable';
// components
import Scrollbar from '../../../../../components/Scrollbar';

// ----------------------------------------------------------------------

function createData(no: string, userdonate: string, orderdate: string, source: string, moneydonate: number ) {

  return { no, userdonate, orderdate, source, moneydonate};
}

const TABLE_DATA = [
  createData('0', 'Admin', '20-5-2024', 'facebook', 10),
  createData('1', 'Admin', '20-5-2024', 'facebook', 10),
  createData('2', 'Admin', '20-5-2024', 'zalo', 10),
  createData('3', 'Admin', '20-5-2024', 'facebook', 10),
  createData('4', 'Admin', '20-5-2024', 'facebook', 10),
  createData('5', 'Admin', '20-5-2024', 'facebook', 10),
  createData('6', 'Admin', '20-5-2024', 'facebook', 10),
];

interface Column {
  id: 'no' | 'userdonate' | 'orderdate' | 'source' | 'moneydonate';
  label: string;
  minWidth?: number;
  maxWidth?: number;
  align?: 'right' | 'left';
  format?: (value: number) => string;
}

const COLUMNS: Column[] = [
  { id: 'no', label: 'NO.', minWidth: 10, },
  { id: 'userdonate', label: 'User Creator', minWidth: 170 },
  {
    id: 'orderdate',
    label: 'ORDER DATE',
    minWidth: 170,
    align: "left",
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'source',
    label: 'Source',
    minWidth: 170,
    align: "left",
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'moneydonate',
    label: 'Money date',
    minWidth: 170,
    align: "left",
    format: (value) => value.toLocaleString('en-US'),
  }
];

// ----------------------------------------------------------------------

export default function GroupingListUserDonate() {
  const {
    page,
    rowsPerPage,
    //
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({ defaultRowsPerPage: 10 });

  return (
    <>
      <Scrollbar>
        <TableContainer sx={{ minWidth: 800, maxHeight: 400 }}>
          <Table stickyHeader>
            <TableHead sx={{ mb: 20 }}>
              <TableRow>
                {COLUMNS.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ top: 10, minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {TABLE_DATA.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.no}>
                  {COLUMNS.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={TABLE_DATA.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
      />
    </>
  );
}
