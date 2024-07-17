// @mui
import {
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
} from '@mui/material';
// hooks
import useTable from '../../../../../hooks/useTable';
// components
import Scrollbar from '../../../../../components/Scrollbar';
import Label from 'src/components/Label';
import Iconify from 'src/components/Iconify';
import { useEffect, useState } from 'react';
import LinksServices from 'src/services/LinksServices';
import { LinkDonationModel } from 'src/pages/model/LinkDonationModel';
import EmptyData from 'src/components/EmptyData';

// ----------------------------------------------------------------------

interface UserLinkDonateModel {
  walletAddress: string,
  email: string,
  avatarUrl: string,
  totalDonations: number,
}

function createData(no: string, avatarUrl: string, orderdate: string, source: string, totalDonations: number ) {

  return { no, avatarUrl, orderdate, source, totalDonations};
}

const TABLE_DATA = [
  createData('0', 'Admin', '20-5-2024', 'facebook', 10),
  createData('1', 'Admin', '20-5-2024', 'facebook', 10),
  createData('2', 'Admin', '20-5-2024', 'zalo', 10),
  createData('3', 'Admin', '20-5-2024', 'facebook', 10),
  createData('4', 'Admin', '20-5-2024', 'twitter', 10),
  createData('5', 'Admin', '20-5-2024', 'facebook', 10),
  createData('6', 'Admin', '20-5-2024', 'twitter', 10),
];

interface Column {
  id: 'no' | 'avatarUrl' | 'orderdate' | 'source' | 'totalDonations';
  label: string;
  minWidth?: number;
  maxWidth?: number;
  align?: 'right' | 'left';
  format?: (value: number) => string;
}

const COLUMNS: Column[] = [
  { id: 'no', label: 'NO.', minWidth: 10, },
  { id: 'avatarUrl', label: 'User Creator', minWidth: 170 },
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
    id: 'totalDonations',
    label: 'Money date',
    minWidth: 170,
    align: "left",
    format: (value) => value.toLocaleString('en-US'),
  }
];

// ----------------------------------------------------------------------

export default function GroupingListUserDonate(prop: any) {
  const {
    page,
    rowsPerPage,
    //
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({ defaultRowsPerPage: 10 });

  const linkSvc = new LinksServices();

  const [listUserDonate, setListUserDonate] = useState<UserLinkDonateModel[]>([]);
  const [listUserDonateLink, setListUserDonateLink] = useState<LinkDonationModel[]>([]);

  const loadData = async(id: string) => {
    const result = await linkSvc.getUserDonateLink(id);
    if (result?.status === 200)
    {
      setListUserDonate(result.data);
    }
  }

  // const loadUserDonateLink = async() => 
  // {
  //   const result = await linkSvc.getMostUserDonate();
  //   if (result?.status === 200)
  //     {
  //       setListUserDonateLink(result.data);
  //     }
  // }

  useEffect(() =>
  {
    // loadUserDonateLink();
    loadData(prop);
  }, []);

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
              {TABLE_DATA.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.no}>
                    <TableCell>{row.no}</TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar /> <Label sx={{ ml: 1 }}>{row.avatarUrl}</Label>
                      </Stack>
                    </TableCell>
                    <TableCell>{row.orderdate}</TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Label 
                          sx={{ ml: 1, minWidth: 70 }}
                          color={
                            (row.source === 'zalo' && 'warning') ||
                            (row.source === 'facebook' && 'success') ||
                            'info'
                          }
                        >{row.source}</Label>
                      </Stack>
                    </TableCell>
                    <TableCell align="justify">
                        <Label color='info'>
                          {row.totalDonations} $
                        </Label>
                    </TableCell>
                </TableRow>
              ))}
            </TableBody>
            {!listUserDonate && (
                <Box sx={{ height: 300 }}>
                  <EmptyData />
                </Box>
            )}
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
