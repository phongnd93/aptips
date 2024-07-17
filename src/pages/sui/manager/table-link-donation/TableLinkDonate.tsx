// @mui
import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  Button,
} from '@mui/material';
// hooks
import useTable from '../../../../hooks/useTable';
// components
import Scrollbar from '../../../../components/Scrollbar';

// ----------------------------------------------------------------------

function createData(no: string, usercreator: string, orderdate: string, link: string, donation: number, donators: number, detail: boolean ) {

  return { no, usercreator, orderdate, link, donation, donators, detail };
}

const TABLE_DATA = [
  createData('0', 'Admin', '20-5-2024', 'sui/123-123-123', 30, 30, true),
  createData('1', 'Admin', '20-5-2024', 'sui/123-123-123', 30, 30, true),
  createData('2', 'Admin', '20-5-2024', 'sui/123-123-123', 30, 30, true),
  createData('3', 'Admin', '20-5-2024', 'sui/123-123-123', 30, 30, true),
  createData('4', 'Admin', '20-5-2024', 'sui/123-123-123', 30, 30, true),
  createData('5', 'Admin', '20-5-2024', 'sui/123-123-123', 30, 30, true),
  createData('6', 'Admin', '20-5-2024', 'sui/123-123-123', 30, 30, true),
];

interface Column {
  id: 'no' | 'usercreator' | 'orderdate' | 'link' | 'donation' | 'donators' | 'detail';
  label: string;
  minWidth?: number;
  maxWidth?: number;
  className?: string;
  align?: 'right' | 'left';
  format?: (value: any) => string;
  
}

const COLUMNS: Column[] = [
  { id: 'no', label: 'NO.', minWidth: 10, },
  { id: 'usercreator', label: 'User Creator', minWidth: 150 },
  {
    id: 'orderdate',
    label: 'ORDER DATE',
    minWidth: 150,
    align: "left",
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'link',
    label: 'Link',
    minWidth: 190,
    align: "left",
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'donation',
    label: 'Donation',
    minWidth: 190,
    align: "left",
    format: (value) => value.toFixed(2),
  },
  {
    id: 'donators',
    label: 'Donatior',
    minWidth: 170,
    align: "left",
    format: (value) => value.toFixed(2),
  },                            
];

// ----------------------------------------------------------------------

export default function TableLinkDonate() {
  const {
    page,
    rowsPerPage,
    //
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({ defaultRowsPerPage: 10 });

  const handleChangeConnect = (row: string) =>{
    
  }

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
                <TableCell style={{ top: 10 }}>
                    {/* Detail */}
                </TableCell>
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
                  <TableCell align="justify">
                    <Button
                      sx={{ right: 40, top: 2 }}
                      variant="text"
                      color='info'
                      onClick={() => {
                        handleChangeConnect(row.no);
                      }}
                    >
                      detail
                    </Button>
              </TableCell>
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
