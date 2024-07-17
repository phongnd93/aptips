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
  Box,
  Typography,
  styled,
  Dialog,
  TextField,
  Tooltip,
} from '@mui/material';
// hooks
// components
import Scrollbar from '../../../../../components/Scrollbar';
import Label from 'src/components/Label';
import Iconify from 'src/components/Iconify';
import { useContext, useMemo, useState } from 'react';

import createAvatar from 'src/utils/createAvatar';

import { alpha } from '@mui/material';
import { Transaction } from 'src/@types/transaction';
import { LinkDonateContext } from 'src/contexts/ManagerLinkContext';
// ----------------------------------------------------------------------

const EmptyDataContainerStyle = styled(Stack)(({ theme }) => ({
  left: 0,
  top: 0,
  zIndex: 10,
  position: 'absolute',
  width: '100%',
  height: '100%',
  paddingY: theme.spacing(5)
}));

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

// ----------------------------------------------------------------------

export default function GroupingListUserDonate()
{
  const {
    listUserDonate,
  } = useContext(LinkDonateContext);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
    if (listUserDonate?.length > 0)
    {
      const temp = (rowsPerPage > 0 ? listUserDonate.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : listUserDonate).map((row: Transaction, i: number) =>
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
                <Label sx={{ ml: 1 }} color='default'>
                  {row.name}
                </Label>
              </Stack>
            </TableCell>
            <TableCell align="justify">
              <Stack direction={'row'}>
                <Label color='primary'>
                  {row.amount}
                </Label>
                <Iconify icon={'token-branded:sui'} width={24} height={24} />
              </Stack>
            </TableCell>
            <TableCell>
              {row.note && (
                <Tooltip title={row.note} placement="top-start">
                  <Typography
                    sx={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}
                  >
                    <Label color='info'> {row.note}</Label>
                  </Typography >
                </Tooltip>
              )}
              {!row.note && (<Label color='default'>No data</Label>)}
            </TableCell>
            <TableCell>{row.timeStamp ? <Label color='secondary'>{new Date(row.timeStamp).toDateString()}</Label> : <Label color='default'>No data</Label>}</TableCell>
            <TableCell>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Label
                  sx={{ ml: 1, minWidth: 70 }}
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
    else
    {
      const temp = (
        <Box sx={{ height: 300 }}>
          <EmptyDataContainerStyle justifyContent={'center'} alignContent={'center'} alignItems={"center"}>
            <Box className={'background'} sx={{ opacity: 0.7, background: (theme) => theme.palette.background.default }} width={'100%'} height={'100%'}></Box>
            <Stack sx={{ position: 'absolute' }} justifyContent={'center'} alignContent={'center'} alignItems={"center"} spacing={2}>
              <Typography variant="h5">No user donate </Typography>
            </Stack>
          </EmptyDataContainerStyle>
        </Box>
        // <EmptyData  />
      )

      return temp;
    };
  }, [listUserDonate, page, rowsPerPage]);

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
                    style={{ minWidth: column.minWidth }}
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

      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={listUserDonate.length || 0}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}
