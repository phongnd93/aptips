
import Layout from '../../../../layouts';
import Page from '../../../../components/Page';
import { Box, Button, Card, CardActionArea, CardContent, CardHeader, Container, Dialog, Grid, Icon, ListItemIcon, Popover, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import useSettings from 'src/hooks/useSettings';
import { useContext, useEffect, useState } from 'react';

import AppWidgetSummary from './detail/AppWidgetSummary';
import GroupingListUserDonate from './detail/GroupingListUserDonate';
import Iconify from 'src/components/Iconify';
import { ShareSocial } from 'src/components/share';
import { SUI_DONA_PATH } from 'src/routes/paths';
import Link from 'next/link';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import { useRouter } from 'next/router';
import AppAreaInstalled from './detail/AppAreaInstalled';

import { _appTransactions } from '../../../../_mock/_app';
import { LinkDonateContext } from 'src/contexts/ManagerLinkContext';

// ----------------------------------------------------------------------

DetailLinkDonation.getLayout = function getLayout(page: React.ReactElement)
{
    return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function DetailLinkDonation(value?: string)
{
    const mockData = _appTransactions;

    const { themeStretch } = useSettings();

    const router = useRouter();
    const { id } = router.query;

    const {
        revenue,
        loadListUserDonate,
        loadRevenue,
        loadDetailLink
    } = useContext(LinkDonateContext)

    const [isOpenShare, setIsOpenShare] = useState<boolean>(false);

    const [detailLink, setDetailLink] = useState<any>();

    const theme = useTheme();

    const loadDetail = async () =>
    {
        const result = await loadDetailLink(id);

        if (result.status === 200)
        {
            setDetailLink(result.data.data);
        }
    }

    const loadData = async () =>
    {
        await loadDetail();
        await loadListUserDonate(id);
        await loadRevenue(id)
    }

    const handleClickEdit = () =>
    {
        router.push({
            pathname: `${SUI_DONA_PATH.manager.form}`,
            query: { id: id },
        });
    }

    useEffect(() =>
    {
        loadData();
    }, [id]);

    return (
        <Page title="Manager: Link Donation" sx={{ mt: 10 }}>
                <Container maxWidth={themeStretch ? false : 'lg'} >
                    <Box sx={{ pt: 4, mb: 1, pl: 1 }} >
                            <Stack spacing={2} direction={'row'}>
                                <HeaderBreadcrumbs
                                    heading='Detail Link Donate'
                                    links={[
                                        { name: 'List Links', href: SUI_DONA_PATH.manager.link },
                                        { name: 'Detail Links' },
                                    ]}
                                />
                                <Typography 
                                    variant='h4' 
                                    sx={{ ml: 1, color: 'Highlight' }}
                                    onClick={() => 
                                    {
                                        setIsOpenShare(true);
                                    }}
                                >
                                    donation/{detailLink?.linkCode}
                                </Typography>
                                <Box sx={{ ml: 4, display: 'flex', height: 35, mt: 4 }}>
                                    <Link href={SUI_DONA_PATH.manager.form}>
                                        <Button
                                            variant="outlined"
                                            color="info"
                                            size='small'
                                            startIcon={<Iconify icon="ic:edit" />}
                                            onClick={() =>
                                            {
                                                handleClickEdit(id);
                                            }}
                                        >Edit</Button>
                                    </Link>
                                    <Button
                                        sx={{ ml: 1, textAlign: 'center' }}
                                        variant="outlined"
                                        color="warning"
                                        size='small'
                                        startIcon={<Iconify icon="ic:share" />}
                                        onClick={() =>
                                        {
                                            setIsOpenShare(true);
                                        }}
                                    >Share</Button>  
                                </Box>
                            </Stack>
                    </Box>
                    <Card sx={{ mb: 2 }}>
                        <CardHeader  title="Overview" />
                        <CardActionArea/>
                        <CardContent >
                            <Grid sx={{ display: 'flex' }}>
                                <Grid spacing={3} sx={{ width: '50%', mr: 3 }} >
                                    <Grid item md={11} sx={{ mb: 2}}>
                                        <AppWidgetSummary
                                            title="Total SUI"
                                            itemIcon='token-branded:sui'
                                            percent={detailLink?.totalDonations > 0 ? 100 : 0}
                                            total={detailLink?.totalDonations}
                                            chartColor={theme.palette.primary.main}
                                            chartData={[5, 18, 12, 51, 68, 11, 39, 37, 27, 20]}
                                        />
                                    </Grid>

                                    <Grid item md={11} sx={{ mb: 2 }}>
                                        <AppWidgetSummary
                                            title="Donations"
                                            itemIcon='ph:user'
                                            percent={detailLink?.totalNumberDonations > 0 ? 100 : 0}
                                            total={detailLink?.totalNumberDonations}
                                            chartColor={theme.palette.chart.blue[0]}
                                            chartData={[20, 41, 63, 33, 28, 35, 50, 46, 11, 26]}
                                        />
                                    </Grid>

                                    <Grid item md={11} sx={{ mb: 2 }}>
                                        <AppWidgetSummary 
                                            title="New donators"
                                            itemIcon='ph:user'
                                            percent={detailLink?.totalNumberDonations > 0 ? 100 : 0}
                                            total={detailLink?.totalNumberDonations}
                                            chartColor={theme.palette.chart.red[0]}
                                            chartData={[8, 9, 31, 8, 16, 37, 8, 33, 46, 31]}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid sx={{ width: '50%', }}>
                                    <AppAreaInstalled title="Revenue" data={revenue} />
                                </Grid>
                            </Grid>
                    </CardContent>
                </Card>
                <Card sx={{ mt: 2, mb: 2 }}>
                    <ListItemIcon />
                    <CardHeader title='Recent donations' />
                    <CardActionArea />
                    <CardContent>
                        <GroupingListUserDonate />
                    </CardContent>
                </Card>
            </Container>

            <Dialog
                open={isOpenShare}
                closeAfterTransition
                onClose={() => { setIsOpenShare(false) }}
            >
                <ShareSocial value={detailLink?.linkCode} />
            </Dialog>
        </Page>
    )
};
