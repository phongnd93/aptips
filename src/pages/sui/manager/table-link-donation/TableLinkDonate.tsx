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
import EmptyData from 'src/components/EmptyData';
import Link from "next/link";
import { LinkDonationModel } from 'src/@types/link-donation';
import { useContext, useEffect, useMemo, useState } from 'react';
import LinksServices from 'src/services/LinksServices';
import MyAvatar from 'src/components/MyAvatar';
import { LinkDonateContext } from '../../../../contexts/ManagerLinkProvider';

// ----------------------------------------------------------------------

// function createData(no: string, name: string, orderdate: string, linkCode: string, donation: number, amount: number, id?: number ) {

//   return { no, name, orderdate, linkCode, donation, amount };
// }

// const TABLE_DATA = [
//   createData('0', 'Admin', '20-5-2024', 'sui/123-123-123', 30, 30),
//   createData('1', 'Admin', '20-5-2024', 'sui/123-123-123', 30, 30),
//   createData('2', 'Admin', '20-5-2024', 'sui/123-123-123', 30, 30),
//   createData('3', 'Admin', '20-5-2024', 'sui/123-123-123', 30, 30),
//   createData('4', 'Admin', '20-5-2024', 'sui/123-123-123', 30, 30),
//   createData('5', 'Admin', '20-5-2024', 'sui/123-123-123', 30, 30),
//   createData('6', 'Admin', '20-5-2024', 'sui/123-123-123', 30, 30),
// ];

interface Column {
  id: 'id' | 'name' | 'orderdate' | 'linkCode' | 'amount' | 'detail';
  label: string;
  minWidth?: number;
  maxWidth?: number;
  className?: string;
  align?: 'right' | 'left';
  format?: (value: any) => string;
}

const COLUMNS: Column[] = [
  { id: 'id', label: 'NO.', minWidth: 10, },
  { id: 'name', label: 'User Creator', minWidth: 150 },
  {
    id: 'orderdate',
    label: 'ORDER DATE',
    minWidth: 150,
    align: "left",
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'linkCode',
    label: 'Link',
    minWidth: 190,
    align: "left",
    format: (value) => value.toLocaleString('en-US'),
  },
  // {
  //   id: 'donation',
  //   label: 'Donation',
  //   minWidth: 190,
  //   align: "left",
  //   format: (value) => value.toFixed(2),
  // },
  {
    id: 'amount',
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

  const {
    listLinks,
    loadDataLink,

    linkId,
    setLinkId,
  } = useContext(LinkDonateContext)

  var linkSvc = new LinksServices()

  const loadData = async(reques?: any) => {
       await loadDataLink();
  }

  const listLinkTable = useMemo(() =>{

    if (listLinks.length > 0)
    {
      const temp = listLinks.map((row: LinkDonationModel) => {
          return (
            <TableRow hover role="checkbox" tabIndex={-1} key={row?.id} sx={{ pl: 1, pr: 1 }}>
              <TableCell>{row.id}</TableCell>
              <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <MyAvatar /> <Label sx={{ ml: 1 }}>{row.name}</Label>
                        </Stack>
              </TableCell>
              <TableCell>{row?.orderdate}</TableCell>
              <TableCell>
                        <Label
                          color='info'
                          onClick={() => {
                          } }
                        >
                          {row.linkCode}
                        </Label>
              </TableCell>
              <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Iconify icon={'ph:user'} sx={{ width: 16, height: 16, mr: 1 }} />
                          <Box sx={{ ml: 1 }}>{row.amount}</Box>
                        </Stack>
              </TableCell>
              <TableCell align="justify">
                        <Link href={SUI_DONA_PATH.manager.detail} key={row?.id}>
                            <Button
                              sx={{ right: 15, top: 0, mt: 0 }}
                              variant='text'
                              color='info'
                              onClick={() =>{
                                console.log(row.id);
                                setLinkId(row.id);
                              }}
                            >
                              Detail
                            </Button>
                        </Link>
              </TableCell>
            </TableRow>
          );
      });

      return temp;
    }
    else
    {
      const temp= (
         <Box sx={{ height: 300 }}>
           <EmptyData />
         </Box>
      )
      return temp;
    }

  }, [listLinks])

  useEffect(() =>
  {
    loadData();
  }, [])

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
                    Detail
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {listLinkTable}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={listLinks?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
      />
    </>
  );
}
