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

import { useContext, useEffect, useMemo, useState } from 'react';
import LinksServices from 'src/services/LinksServices';
import MyAvatar from 'src/components/MyAvatar';
import { LinkDonateContext } from 'src/contexts/ManagerLinkProvider';
import useSuiAuth from 'src/hooks/useSuiAuth';
import { LinkDonationModel } from 'src/@types/link-donation';
import { useRouter } from 'next/router';


// ----------------------------------------------------------------------

interface Column {
  id: 'id' | 'orderdate' | 'linkCode' | 'amount' | 'sui' | '';
  label: string;
  minWidth?: number;
  maxWidth?: number;
  className?: string;
  align?: 'right' | 'left';
  format?: (value: any) => string;
}

const COLUMNS: Column[] = [
  { id: 'id', label: 'NO.', minWidth: 30, },
  {
    id: 'linkCode',
    label: 'Link',
    minWidth: 200,
    align: "left",
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'orderdate',
    label: 'Date',
    minWidth: 180,
    align: "left",
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'amount',
    label: 'Donates',
    minWidth: 180,
    align: "left",
  },
  {
    id: 'sui',
    label: 'SUI',
    minWidth: 100,
    align: "left",
    format: (value) => value.toFixed(2),
  },  
  {
    id: '',
    label: '',
    minWidth: 20,
    align: "right",
    format: (value) => value.toFixed(2),
  },                          
];

// ----------------------------------------------------------------------

export default function TableLinkDonate() {

  const {
    listLinks,
    loadDataLink,

    linkId,
    setLinkId,
  } = useContext(LinkDonateContext)

  const { info } = useSuiAuth();
  const router = useRouter();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const loadData = async(reques?: any) => {
       await loadDataLink(info?.id);
  }

  const handleClickDetail = (id: number) => 
  {
      router.push(`${SUI_DONA_PATH.manager.detail}/${id}`);
  }

  const listLinkTable = useMemo(() =>{
  
    if (listLinks.length > 0)
    {
      const temp = (rowsPerPage > 0  ? listLinks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage): listLinks).map((row: LinkDonationModel) => {
          return (
            <TableRow hover role="checkbox" tabIndex={-1} key={row?.id} sx={{ pl: 1, pr: 1 }} onClick={() =>{handleClickDetail(row.id)}}>
              <TableCell>{row.id}</TableCell>
              <TableCell>
                        <Label
                          color='info'
                          onClick={() => {
                          } }
                        >
                          {row.linkCode || ''}
                        </Label>
              </TableCell>
              <TableCell>{row?.orderdate || ''}</TableCell>
              <TableCell>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    {row.amount && (
                      <>
                        <Iconify icon={'ph:user'} sx={{ width: 16, height: 16, mr: 1 }} />
                        <Box sx={{ ml: 1 }}>{row.amount}</Box>
                      </>
                    )}
                  </Stack>
              </TableCell>
              <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {/* <Iconify icon={'ph:user'} sx={{ width: 16, height: 16, mr: 1 }} /> */}
                    {row.sui &&(
                      <Label
                        color='info'
                      ><Box sx={{}}>{row.sui}</Box></Label>
                    )}
                  </Stack>
              </TableCell>

              <TableCell align="justify">
                    <Button
                      sx={{ right: 15, top: 0, mt: 0 }}
                      variant='text'
                      color='info'
                      onClick={() =>{
                        console.log(row.id);
                        setLinkId(row.id);
                      }}
                    >
                       <Iconify icon={'bi:arrow-right'} sx={{ width: 16, height: 16, mr: 1 }} />
                    </Button>
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
              </TableRow>
            </TableHead>

            <TableBody>
              {listLinkTable}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={listLinks.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}
