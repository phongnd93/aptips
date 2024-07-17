// @mui
import
{
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  Stack,
  Avatar,
  Card,
  CardHeader,
  Divider,
} from '@mui/material';
// hooks

// components
import Label from 'src/components/Label';
import Iconify from 'src/components/Iconify';
import { useEffect, useMemo, useState } from 'react';

import EmptyData from 'src/components/EmptyData';
import createAvatar from 'src/utils/createAvatar';
import Scrollbar from 'src/components/Scrollbar';
import { Transaction } from 'src/@types/transaction';
import { _appTransactions } from '../../../../_mock/_app';
import { alpha } from '@mui/material';


// ----------------------------------------------------------------------

interface Column
{
  id: 'id' | 'name' | 'amount' | 'note' | 'timeStamp' | 'sourceId';
  label: string;
  minWidth?: number;
  maxWidth?: number;
  align?: 'right' | 'left';
  format?: (value: number) => string;
}

const COLUMNS: Column[] = [
  { id: 'id', label: 'NO.', minWidth: 10, },
  { id: 'name', label: 'Name', minWidth: 100 },
  {
    id: 'amount',
    label: 'Amount',
    minWidth: 100,
    align: "left",
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'note',
    label: 'Note',
    minWidth: 100,
    maxWidth: 120,
    align: "left",
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'timeStamp',
    label: 'Time stamp',
    minWidth: 100,
    align: "left",
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'sourceId',
    label: 'Source',
    minWidth: 100,
    align: "left",
    format: (value) => value.toLocaleString('en-US'),
  },
];

type AppNewInvoiceProps = {
  dataReport: Transaction[]
}

// ----------------------------------------------------------------------

export default function TableReportData({ dataReport }: AppNewInvoiceProps)
{

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const mockData = _appTransactions;

  const handleChangePage = (event: any, newPage: any) =>
  {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) =>
  {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const listUserTable = useMemo(() =>
  {
    if (dataReport?.length > 0)
    {
      const temp = (rowsPerPage > 0 ? dataReport.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : dataReport).map((row: Transaction, i: number) =>
      {
        const ava = createAvatar(row.name);
        return (
          <TableRow hover role="checkbox" tabIndex={-1} key={row.sourceId}>
            <TableCell>{i + page * rowsPerPage + 1}</TableCell>
            <TableCell>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  src={''}
                  alt={row.name}
                  sx={{ bgcolor: (theme) => alpha(theme.palette[ava.color].main, 0.08) }}
                >
                  {ava.name}
                </Avatar>
                <Label sx={{ ml: 1 }}>
                  {row.name}
                </Label>
              </Stack>
            </TableCell>
            <TableCell>
              <Stack direction={'row'} spacing={1}>
                <Label color='primary'>
                  {row.amount}
                </Label>
                <Iconify icon={'token-branded:sui'} width={24} height={24} />
              </Stack>
            </TableCell>
            <TableCell size='medium'>
              {row?.note ? <Label color='warning'>{row.note}</Label> : <Label color='default'>No data</Label>}
            </TableCell>
            <TableCell>{row.timeStamp ? <Label color='secondary'>{new Date(row.timeStamp).toDateString()}</Label> : <Label color='default'>No data</Label>}</TableCell>
            <TableCell>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Label
                  color={
                    (row.sourceId === 0 && 'warning') ||
                    (row.sourceId === 1 && 'success') ||
                    'info'
                  }
                >{row.sourceName}</Label>
              </Stack>
            </TableCell>
          </TableRow>
        );
      })

      return temp;
    }
    return [];
  }, [dataReport, page, rowsPerPage]);

  useEffect(() =>
  {
  }, []);

  return (
    <Card sx={{ minHeight: '30vh' }}>
      <CardHeader title="Recent Donate" sx={{ mb: 3 }} />
      <Scrollbar>
        <TableContainer>
          <Table stickyHeader>
            <TableHead sx={{ mb: 20 }}>
              <TableRow>
                {COLUMNS.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth, maxWidth: column.maxWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {listUserTable}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <Divider />

      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={dataReport.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {!listUserTable?.length && <EmptyData />}
    </Card >
  );
}
