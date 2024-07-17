import Layout from '../../../layouts';
import Page from '../../../components/Page';
import { Box, Breadcrumbs, Card, CardActionArea, CardContent, CardHeader, Container, Grid, Rating, Typography } from '@mui/material';
import useSettings from 'src/hooks/useSettings';
import { useState } from 'react';

import TableLinkDonate from './table-link-donation/TableLinkDonate';
import TextIconLabel from 'src/components/TextIconLabel';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import other from 'src/sections/overview/extra/animate/other';
import EmptyPage from 'src/components/empty-page/EmptyPage';
// ----------------------------------------------------------------------

ManagerLinkDonation.getLayout = function getLayout(page: React.ReactElement) {
    return <Layout>{page}</Layout>;
  };

// ----------------------------------------------------------------------

export default function ManagerLinkDonation() {
    const { themeStretch } = useSettings();

    return (
        <Page title="Manager: Link Donation" sx={{ mt: 4 }}>
           
            <Container maxWidth={themeStretch ? false : 'lg'} sx={{ mt:10, mb: 10 }}>
                <Typography variant="h4" sx={{ display: 'flex', mb: 3 }}>
                            Detail Link Donate 
                </Typography>
                <Card>
                    <CardHeader>
                    
                    </CardHeader>
                    <CardContent>
                        <TableLinkDonate />
                    </CardContent>
                </Card>
                <EmptyPage />
            </Container>
        </Page>
    )
};