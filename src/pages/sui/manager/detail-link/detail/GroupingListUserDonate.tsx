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
import { useContext, useEffect, useMemo, useState } from 'react';
import LinksServices from 'src/services/LinksServices';
import { LinkDonationModel } from 'src/pages/model/LinkDonationModel';
import EmptyData from 'src/components/EmptyData';
import MyAvatar from 'src/components/MyAvatar';
import createAvatar from 'src/utils/createAvatar';
import { LinkDonateContext } from '../../ManagerLinkProvider';

// ----------------------------------------------------------------------

interface UserLinkDonateModel {
  walletAddress: string,
  email: string,
  avatarUrl: string,
  totalDonations: number,

  orderdate: string,
  source: string,
}

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
  { id: 'avatarUrl', label: 'Donator', minWidth: 170 },
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
    label: 'SUI',
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

  const {
    linkId,
    loadListUserDonate,
    listUserDonate,
  } = useContext(LinkDonateContext);

  console.log(linkId);

  const loadData = async() => {
     await loadListUserDonate(linkId);
  }

  const avataURl = (user: any) =>
  {
    const template = (
      <Avatar
        src={user?.photoURL || ''}
        alt={user?.userAddr}
        color={user?.photoURL ? 'default' : createAvatar(user?.ephemeralPrivateKey || user?.userAddr || '').color}
      >
        {createAvatar(user?.ephemeralPrivateKey || user?.userAddr || '').name}
      </Avatar>
    )
    return template;
  }

  const listUserTable = useMemo(() =>
  {
      if (listUserDonate?.length > 0)
      {
          const temp = listUserDonate.map((row: UserLinkDonateModel)=>
          {
            const avata = avataURl(row.avatarUrl);
            return (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.walletAddress}>
                    <TableCell></TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        {avata} <Label sx={{ ml: 1 }}>{row.walletAddress}</Label>
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
            );
          })

          return temp;
      }
      else
      {
        const temp = (
          <Box sx={{ height: 300 }}>
            <EmptyData />
          </Box>
        )

        return temp;
      }
  }, [listUserDonate]);

  useEffect(() =>
  {
    loadData();
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
                {listUserTable}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={listUserDonate?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
      />
    </>
  );
}
