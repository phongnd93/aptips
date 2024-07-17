import Layout from '../../../../layouts';
import Page from '../../../../components/Page';
import { Box, Button, Card, CardActionArea, CardContent, CardHeader, Container, Dialog, Grid, Icon, ListItemIcon, Popover, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import useSettings from 'src/hooks/useSettings';
import { useState } from 'react';

import TextIconLabel from 'src/components/TextIconLabel';
import AppAreaInstalled from './detail/AppAreaInstalled';
import AppWidgetSummary from './detail/AppWidgetSummary';
import GroupingListUserDonate from './detail/GroupingListUserDonate';
import Iconify from 'src/components/Iconify';
import { FabButtonAnimate } from 'src/components/animate';
import { ShareSocial } from 'src/components/share';
import { Popup } from 'react-map-gl';
import { MapControlPopup } from 'src/components/map';
import { SUI_DONA_PATH } from 'src/routes/paths';
import Link from 'next/link';
import { styled } from '@mui/material/styles';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';

// ----------------------------------------------------------------------

DetailLinkDonation.getLayout = function getLayout(page: React.ReactElement) {
    return <Layout>{page}</Layout>;
};

const RootStyle = styled('div')(({ theme }) => ({
    paddingTop: theme.spacing(15),
    paddingBottom: theme.spacing(5),
}));

// ----------------------------------------------------------------------

export default function DetailLinkDonation(props: { value?: string }) {
    const { themeStretch } = useSettings();
    const [idLinkSui, setIdLinkSui ] = useState('sui/623-567-7355');

    const [isOpenShare, setIsOpenShare] = useState<boolean>(false);
    const theme = useTheme();

    return (
        <Page title="Manager: Link Donation" sx={{ mt: 10 }}>
            <Container maxWidth={themeStretch ? false : 'lg'} >
                <Box sx={{ pt: 4, mb: 1, pl: 1 }} >
                        <Stack spacing={2} direction={'row'}>
                            <HeaderBreadcrumbs
                                heading='Detail Link Donate'
                                links={[
                                    { name: 'List Links', href: SUI_DONA_PATH.manager.link,  },
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
                                {idLinkSui}
                            </Typography>
                            <Box sx={{ ml: 4, display: 'flex', height: 35, mt: 4 }}>
                                <Link href={SUI_DONA_PATH.manager.form}>
                                    <Button
                                        variant="outlined"
                                        color="info"
                                        size='small'
                                        startIcon={<Iconify icon="ic:edit" />}
                                        href={SUI_DONA_PATH.manager.form}
                                    >Edit</Button>
                                </Link>
                                <Button
                                    sx={{ ml: 1, textAlign: 'center' }}
                                    variant="outlined"
                                    color="error"
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
                                        title="Total Active Users"
                                        percent={2.6}
                                        total={18765}
                                        chartColor={theme.palette.primary.main}
                                        chartData={[5, 18, 12, 51, 68, 11, 39, 37, 27, 20]}
                                    />
                                </Grid>

                                <Grid item md={11} sx={{ mb: 2}}>
                                    <AppWidgetSummary
                                        title="Total Installed"
                                        percent={0.2}
                                        total={4876}
                                        chartColor={theme.palette.chart.blue[0]}
                                        chartData={[20, 41, 63, 33, 28, 35, 50, 46, 11, 26]}
                                    />
                                </Grid>

                                <Grid item md={11} sx={{ mb: 2}}>
                                    <AppWidgetSummary
                                        title="Total Downloads"
                                        percent={-0.1}
                                        total={678}
                                        chartColor={theme.palette.chart.red[0]}
                                        chartData={[8, 9, 31, 8, 16, 37, 8, 33, 46, 31]}
                                    />
                                </Grid>   
                            </Grid>
                            <Grid sx={{ width: '50%', }}>
                                <AppAreaInstalled />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                <Card sx={{ mt: 2, mb: 2 }}>
                    <ListItemIcon />
                    <CardHeader title=' List user donate' />
                    <CardActionArea/>
                    <CardContent >
                        <GroupingListUserDonate />
                    </CardContent>
                </Card>
            </Container>

            <Dialog
                open={isOpenShare}
                closeAfterTransition
                onClose={() => {setIsOpenShare(false) }}
            >
                <ShareSocial  />
            </Dialog>
        </Page>
    )
};