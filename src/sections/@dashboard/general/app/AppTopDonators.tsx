import orderBy from 'lodash/orderBy';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, Stack, Card, Avatar, CardHeader, Typography, Container } from '@mui/material';
// utils
import { fShortenNumber } from '../../../../utils/formatNumber';
// _mock_
import { _appAuthors, _appDonators } from '../../../../_mock';
// components
import Iconify from '../../../../components/Iconify';
import EmptyData from 'src/components/EmptyData';
import { Donator } from 'src/@types/transaction';
import { useMemo } from 'react';
import createAvatar from 'src/utils/createAvatar';

// ----------------------------------------------------------------------

const IconWrapperStyle = styled('div')(({ theme }) => ({
    width: 40,
    height: 40,
    display: 'flex',
    borderRadius: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
}));

// ----------------------------------------------------------------------
type AppTopDonatorsProps = {
    data: Donator[]
}

export default function AppTopDonators({ data }: AppTopDonatorsProps)
{
    const tempData = _appDonators;
    const displayDonators = useMemo(() =>
    {
        const orderData = orderBy(data, ['totalDonations'], ['desc']);
        return orderData.map(d => ({
            id: d.walletAddress,
            wallet: d.walletAddress,
            avatar: createAvatar(d.walletAddress),
            total: d.totalDonations
        }));

    }, [data]);
    return (
        <Card>
            <CardHeader title="Top Donators" />
            <Stack spacing={3} sx={{ p: 3 }}>
                {displayDonators.map((author, index) => (
                    <DonatorItem key={author.id} donator={author} index={index} />
                ))}
            </Stack>
            {!displayDonators?.length && <Container sx={{ py: (theme) => theme.spacing(5) }}><EmptyData /></Container>}
        </Card>
    );
}

// ----------------------------------------------------------------------

type DonatorItemProps = {
    donator: {
        wallet: string;
        avatar: { name: string, color: string };
        total: number;
    };
    index: number;
};

function DonatorItem({ donator, index }: DonatorItemProps)
{
    return (
        <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={donator.wallet} src='' sx={{ bgcolor: (theme) => alpha(theme.palette[donator.avatar.color].main, 0.08) }}>
                {donator.avatar.name}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2">{donator.wallet}</Typography>
                <Typography
                    variant="caption"
                    sx={{
                        mt: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        color: 'text.secondary',
                    }}
                >
                    <Iconify icon={'token-branded:sui'} sx={{ width: 28, height: 28 }} />
                    {fShortenNumber(donator.total)}
                </Typography>
            </Box>

            <IconWrapperStyle
                sx={{
                    ...(index === 0 && {
                        color: 'info.main',
                        bgcolor: (theme) => alpha(theme.palette.info.main, 0.08),
                    }),
                    ...(index === 1 && {
                        color: 'error.main',
                        bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
                    }),
                    ...(index === 2 && {
                        color: 'warning.main',
                        bgcolor: (theme) => alpha(theme.palette.warning.main, 0.08),
                    }),
                }}
            >
                <Iconify icon={'ant-design:trophy-filled'} width={20} height={20} />
            </IconWrapperStyle>
        </Stack >
    );
}
