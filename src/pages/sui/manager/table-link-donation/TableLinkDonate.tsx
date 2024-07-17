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
  Avatar,
  Stack,
  Box,
} from '@mui/material';
// hooks
import useTable from '../../../../hooks/useTable';
// components
import Scrollbar from '../../../../components/Scrollbar';
import Label from 'src/components/Label';
import Iconify from 'src/components/Iconify';
import { SUI_DONA_PATH } from 'src/routes/paths';

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
                    style={{ top: 0, minWidth: column.minWidth }}
                  >
                      {column.label}
                  </TableCell>
                ))}
                <TableCell>
                    {/* Detail */}
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {TABLE_DATA.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.no} sx={{ pl: 1, pr: 1 }}>
                    <TableCell>{row.no}</TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar /> <Label sx={{ ml: 1 }}>{row.usercreator}</Label>
                      </Stack>
                    </TableCell>
                    <TableCell>{row.orderdate}</TableCell>
                    <TableCell>
                      <Label
                        color='info'
                        onClick={() => {
                        } }
                      >
                        {row.link}
                      </Label>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar /> <Box sx={{ ml: 1 }}> {row.donation}</Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Iconify icon={'ph:user'} sx={{ width: 16, height: 16, mr: 1 }} />
                        <Box sx={{ ml: 1 }}>{row.donators}</Box>
                      </Stack>
                    </TableCell>
                    <TableCell align="justify">
                      <Button
                        sx={{ right: 40, top: 0, mt: 0 }}
                        variant='text'
                        color='info'
                        href={SUI_DONA_PATH.manager.detail}
                      >
                        Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
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
